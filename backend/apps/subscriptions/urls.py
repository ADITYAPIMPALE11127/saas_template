from django.urls import path
from . import views

urlpatterns = [
    path('plans/', views.PlanListView.as_view(), name='plan-list'),
    path('my-subscription/', views.MySubscriptionView.as_view(), name='my-subscription'),
    path('my-usage/', views.MyUsageView.as_view(), name='my-usage'),
]