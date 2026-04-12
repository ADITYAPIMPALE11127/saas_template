import uuid
from django.db import models
from django.utils import timezone

class Plan(models.Model):
    """PLN_MST - Plan Master Table"""
    
    PLNUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_column='PLNUID')
    PLNNME = models.CharField(max_length=100, unique=True, db_column='PLNNME', help_text="Plan name (e.g., Free, Pro)")
    PLNPRI = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='PLNPRI', help_text="Plan price in INR")
    USGLIM = models.IntegerField(db_column='USGLIM', help_text="Usage limit per month")
    DURATN = models.IntegerField(default=30, db_column='DURATN', help_text="Duration in days")
    ISACTV = models.BooleanField(default=True, db_column='ISACTV', help_text="Is plan active")
    CRETDT = models.DateTimeField(auto_now_add=True, db_column='CRETDT')
    UPDTDT = models.DateTimeField(auto_now=True, db_column='UPDTDT')
    
    class Meta:
        db_table = 'PLN_MST'
        ordering = ['PLNPRI']
        verbose_name = 'Plan'
        verbose_name_plural = 'Plans'
    
    def __str__(self):
        return f"{self.PLNNME} - ₹{self.PLNPRI} ({self.USGLIM} uses)"
    

class UserSubscription(models.Model):
    """SUB_MST - User Subscription Master Table"""
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    SUBUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_column='SUBUID')
    USRUID = models.ForeignKey('users.User', on_delete=models.CASCADE, db_column='USRUID', related_name='subscriptions')
    PLNUID = models.ForeignKey(Plan, on_delete=models.PROTECT, db_column='PLNUID', related_name='subscriptions')
    STRDAT = models.DateTimeField(default=timezone.now, db_column='STRDAT')
    ENDDAT = models.DateTimeField(db_column='ENDDAT')
    SUBSTS = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE', db_column='SUBSTS')
    CRETDT = models.DateTimeField(auto_now_add=True, db_column='CRETDT')
    UPDTDT = models.DateTimeField(auto_now=True, db_column='UPDTDT')
    
    class Meta:
        db_table = 'SUB_MST'
        ordering = ['-CRETDT']
        verbose_name = 'User Subscription'
        verbose_name_plural = 'User Subscriptions'
    
    def __str__(self):
        return f"{self.USRUID.EMLID} - {self.PLNUID.PLNNME} ({self.SUBSTS})"
    
    def is_active(self):
        return self.SUBSTS == 'ACTIVE' and self.ENDDAT > timezone.now()
    

class Usage(models.Model):
    """USG_MST - Usage Tracking Table"""
    
    SERVICE_TYPES = [
        ('GENERIC', 'Generic Service'),
        # Add more service types as needed
    ]
    
    USGUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_column='USGUID')
    USRUID = models.ForeignKey('users.User', on_delete=models.CASCADE, db_column='USRUID', related_name='usages')
    SRVTYP = models.CharField(max_length=50, choices=SERVICE_TYPES, default='GENERIC', db_column='SRVTYP')
    USGCNT = models.IntegerField(default=0, db_column='USGCNT', help_text="Usage count for current month")
    RSTMON = models.CharField(max_length=7, db_column='RSTMON', help_text="Reset month (YYYY-MM)")
    CRETDT = models.DateTimeField(auto_now_add=True, db_column='CRETDT')
    UPDTDT = models.DateTimeField(auto_now=True, db_column='UPDTDT')
    
    class Meta:
        db_table = 'USG_MST'
        unique_together = [['USRUID', 'SRVTYP', 'RSTMON']]
        ordering = ['-RSTMON']
        verbose_name = 'Usage'
        verbose_name_plural = 'Usages'
    
    def __str__(self):
        return f"{self.USRUID.EMLID} - {self.SRVTYP}: {self.USGCNT} ({self.RSTMON})"