from django.contrib import admin
from .models import Plan, UserSubscription, Usage

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['PLNNME', 'PLNPRI', 'USGLIM', 'DURATN', 'ISACTV']
    list_editable = ['PLNPRI', 'USGLIM', 'DURATN', 'ISACTV']
    search_fields = ['PLNNME']

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['SUBUID', 'USRUID', 'PLNUID', 'STRDAT', 'ENDDAT', 'SUBSTS']
    list_filter = ['SUBSTS', 'PLNUID']
    search_fields = ['USRUID__EMLID']

@admin.register(Usage)
class UsageAdmin(admin.ModelAdmin):
    list_display = ['USRUID', 'SRVTYP', 'USGCNT', 'RSTMON']
    list_filter = ['SRVTYP', 'RSTMON']
    search_fields = ['USRUID__EMLID']