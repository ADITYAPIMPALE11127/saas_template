from django.urls import path
from . import views

urlpatterns = [
    path('service/<str:service_name>/', views.GenericServiceView.as_view(), name='generic-service'),
    path('services/', views.ServiceListView.as_view(), name='service-list'),
]