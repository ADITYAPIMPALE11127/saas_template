from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from .models import Plan, UserSubscription, Usage
from .serializers import PlanSerializer, UserSubscriptionSerializer, UsageSerializer

class PlanListView(APIView):
    """GET /api/plans/ - List all active plans"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        plans = Plan.objects.filter(ISACTV=True)
        serializer = PlanSerializer(plans, many=True)
        return Response(serializer.data)

class MySubscriptionView(APIView):
    """GET /api/my-subscription/ - Get current user's subscription"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get active subscription
        subscription = UserSubscription.objects.filter(
            USRUID=request.user,
            SUBSTS='ACTIVE',
            ENDDAT__gt=timezone.now()
        ).first()
        
        if not subscription:
            # Check for expired but not marked
            expired_sub = UserSubscription.objects.filter(
                USRUID=request.user,
                SUBSTS='ACTIVE',
                ENDDAT__lte=timezone.now()
            ).first()
            
            if expired_sub:
                expired_sub.SUBSTS = 'EXPIRED'
                expired_sub.save()
            
            return Response({
                'has_subscription': False,
                'message': 'No active subscription found'
            }, status=status.HTTP_200_OK)
        
        serializer = UserSubscriptionSerializer(subscription)
        return Response({
            'has_subscription': True,
            **serializer.data
        })

class MyUsageView(APIView):
    """GET /api/my-usage/ - Get current user's usage statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        current_month = timezone.now().strftime('%Y-%m')
        
        # Get or create usage record for current month
        usage, created = Usage.objects.get_or_create(
            USRUID=request.user,
            SRVTYP='GENERIC',
            RSTMON=current_month,
            defaults={'USGCNT': 0}
        )
        
        # Get user's current plan
        subscription = UserSubscription.objects.filter(
            USRUID=request.user,
            SUBSTS='ACTIVE',
            ENDDAT__gt=timezone.now()
        ).first()
        
        plan_limit = 10  # Default Free plan limit
        plan_name = "Free"
        
        if subscription and subscription.PLNUID:
            plan_limit = subscription.PLNUID.USGLIM
            plan_name = subscription.PLNUID.PLNNME
        
        serializer = UsageSerializer(usage)
        
        return Response({
            'usage': serializer.data,
            'usage_count': usage.USGCNT,
            'usage_limit': plan_limit,
            'remaining_usage': max(0, plan_limit - usage.USGCNT),
            'plan_name': plan_name,
            'reset_month': current_month,
            'percentage_used': round((usage.USGCNT / plan_limit) * 100, 2) if plan_limit > 0 else 0
        })