from rest_framework import serializers
from .models import Plan, UserSubscription, Usage

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['PLNUID', 'PLNNME', 'PLNPRI', 'USGLIM', 'DURATN', 'ISACTV']

class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan_details = PlanSerializer(source='PLNUID', read_only=True)
    is_active_status = serializers.SerializerMethodField()
    
    class Meta:
        model = UserSubscription
        fields = ['SUBUID', 'plan_details', 'STRDAT', 'ENDDAT', 'SUBSTS', 'is_active_status']
    
    def get_is_active_status(self, obj):
        return obj.is_active()

class UsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usage
        fields = ['USGUID', 'SRVTYP', 'USGCNT', 'RSTMON']