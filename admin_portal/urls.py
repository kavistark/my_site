from django.urls import path
from . import views

app_name = 'admin_portal'

urlpatterns = [
    path('', views.admin_portal_dashboard, name='dashboard'),
]
