# backend/apps/users/models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import uuid


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    # 6-letter CAPITAL abbreviations for database columns
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_column='USRUID')
    email = models.EmailField(max_length=255, unique=True, db_column='EMLID')
    name = models.CharField(max_length=255, db_column='USRNM')
    password = models.CharField(max_length=128, db_column='PASWRD')
    is_active = models.BooleanField(default=True, db_column='ISACTV')
    is_staff = models.BooleanField(default=False, db_column='ISSTAF')
    is_superuser = models.BooleanField(default=False, db_column='ISSUPR')
    created_at = models.DateTimeField(default=timezone.now, db_column='CRETDT')
    last_login = models.DateTimeField(null=True, blank=True, db_column='LSTLGN')
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    class Meta:
        db_table = 'USR_MST'  # User Master table
    
    def __str__(self):
        return self.email