import time
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Service, RequestLog
from .registry import get_service_handler, list_services
from subscriptions.models import Usage
from subscriptions.views import MyUsageView

User = get_user_model()

class GenericServiceView(APIView):
    """
    POST /api/service/{service_name}/
    
    Generic endpoint that handles:
    - Authentication
    - Usage checking
    - Service execution
    - Usage increment
    - Request logging
    """
    permission_classes = [IsAuthenticated]
    
    def _check_usage_limit(self, user):
        """Check if user has remaining usage"""
        from subscriptions.models import UserSubscription, Usage
        
        current_month = timezone.now().strftime('%Y-%m')
        
        # Get user's current plan
        subscription = UserSubscription.objects.filter(
            USRUID=user,
            SUBSTS='ACTIVE',
            ENDDAT__gt=timezone.now()
        ).first()
        
        plan_limit = 10  # Default Free
        if subscription and subscription.PLNUID:
            plan_limit = subscription.PLNUID.USGLIM
        
        # Get current usage
        usage, created = Usage.objects.get_or_create(
            USRUID=user,
            SRVTYP='GENERIC',
            RSTMON=current_month,
            defaults={'USGCNT': 0}
        )
        
        return usage.USGCNT < plan_limit, plan_limit - usage.USGCNT
    
    def _increment_usage(self, user):
        """Increment user's usage count"""
        from subscriptions.models import Usage
        
        current_month = timezone.now().strftime('%Y-%m')
        usage, created = Usage.objects.get_or_create(
            USRUID=user,
            SRVTYP='GENERIC',
            RSTMON=current_month,
            defaults={'USGCNT': 0}
        )
        usage.USGCNT += 1
        usage.save()
        return usage.USGCNT
    
    def post(self, request, service_name):
        start_time = time.time()
        
        # Check if service exists in registry
        handler = get_service_handler(service_name)
        if not handler:
            return Response(
                {'error': f'Service "{service_name}" not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check service is active in database
        try:
            service = Service.objects.get(SRVNME=service_name, ISACTV=True)
        except Service.DoesNotExist:
            return Response(
                {'error': f'Service "{service_name}" is not active'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check usage limit
        can_use, remaining = self._check_usage_limit(request.user)
        if not can_use:
            return Response(
                {
                    'error': 'Usage limit exceeded',
                    'remaining_usage': 0,
                    'message': 'Please upgrade your plan'
                },
                status=status.HTTP_402_PAYMENT_REQUIRED
            )
        
        # Execute service
        try:
            output = handler(request.data, request.user)
            status_code = 'SUCCESS'
            error_msg = ''
        except Exception as e:
            output = None
            status_code = 'ERROR'
            error_msg = str(e)
        
        # Calculate response time
        response_time_ms = int((time.time() - start_time) * 1000)
        
        # Log request
        RequestLog.objects.create(
            USRUID=request.user,
            SRVNME=service_name,
            INPDTA=request.data,
            OUTDTA=output,
            STATUS=status_code,
            ERRMSG=error_msg,
            RESPMS=response_time_ms
        )
        
        # Increment usage only on success
        if status_code == 'SUCCESS':
            new_usage_count = self._increment_usage(request.user)
            remaining -= 1
        else:
            new_usage_count = None
        
        return Response({
            'success': status_code == 'SUCCESS',
            'output': output,
            'error': error_msg if status_code == 'ERROR' else None,
            'usage': {
                'used': new_usage_count,
                'remaining': remaining if status_code == 'SUCCESS' else remaining + 1,
            }
        })


class ServiceListView(APIView):
    """GET /api/services/ - List all available services"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from .registry import list_services
        
        services = Service.objects.filter(ISACTV=True)
        
        data = {
            'services': [
                {
                    'name': s.SRVNME,
                    'description': s.SRVDSC,
                    'type': s.SRVTPE
                }
                for s in services
            ],
            'registered_handlers': list_services()
        }
        return Response(data)