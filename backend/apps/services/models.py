import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Service(models.Model):
    """SRV_MST - Service Registry Table"""
    
    SERVICE_TYPES = [
        ('AI', 'AI Service'),
        ('UTILITY', 'Utility'),
        ('API', 'External API'),
    ]
    
    SRVUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_column='SRVUID')
    SRVNME = models.CharField(max_length=100, unique=True, db_column='SRVNME', help_text="Service name (e.g., resume_analyzer)")
    SRVTPE = models.CharField(max_length=20, choices=SERVICE_TYPES, default='AI', db_column='SRVTPE')
    SRVDSC = models.TextField(blank=True, db_column='SRVDSC', help_text="Service description")
    ISACTV = models.BooleanField(default=True, db_column='ISACTV')
    CONFIG = models.JSONField(default=dict, blank=True, db_column='CONFIG', help_text="Service configuration")
    CRETDT = models.DateTimeField(auto_now_add=True, db_column='CRETDT')
    UPDTDT = models.DateTimeField(auto_now=True, db_column='UPDTDT')
    
    class Meta:
        db_table = 'SRV_MST'
    
    def __str__(self):
        return self.SRVNME


class RequestLog(models.Model):
    """RQL_MST - Request Log Table"""
    
    RQLUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_column='RQLUID')
    USRUID = models.ForeignKey(User, on_delete=models.CASCADE, db_column='USRUID', related_name='requests')
    SRVNME = models.CharField(max_length=100, db_column='SRVNME')
    INPDTA = models.JSONField(db_column='INPDTA', help_text="Input data")
    OUTDTA = models.JSONField(db_column='OUTDTA', null=True, blank=True, help_text="Output data")
    STATUS = models.CharField(max_length=20, default='SUCCESS', db_column='STATUS')
    ERRMSG = models.TextField(blank=True, db_column='ERRMSG')
    RESPMS = models.IntegerField(db_column='RESPMS', help_text="Response time in milliseconds")
    CRETDT = models.DateTimeField(auto_now_add=True, db_column='CRETDT')
    
    class Meta:
        db_table = 'RQL_MST'
        ordering = ['-CRETDT']
    
    def __str__(self):
        return f"{self.USRUID.EMLID} - {self.SRVNME} - {self.CRETDT}"