"""
nconix_backend URL Configuration
"""

from django.contrib import admin
from django.urls import path, re_path, include
from django.views.static import serve
from django.conf import settings
from core import views as core_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # REST API endpoints
    path('api/contact/', core_views.api_contact, name='api_contact'),
    path('api/enroll/', core_views.api_enroll, name='api_enroll'),
    path('api/quote/', core_views.api_quote, name='api_quote'),
    path('api/newsletter/', core_views.api_newsletter, name='api_newsletter'),
    path('api/live-class-register/', core_views.api_live_class_register, name='api_live_class_register'),
    path('api/stats/', core_views.api_stats, name='api_stats'),
    path('api/auth/register/', core_views.api_register, name='api_register'),
    path('api/auth/login/', core_views.api_login, name='api_login'),
    path('api/auth/logout/', core_views.api_logout, name='api_logout'),
    path('api/auth/user/', core_views.api_current_user, name='api_current_user'),
    path('api/portal/requirements/', core_views.api_project_requirements, name='api_project_requirements'),
    path('api/portal/chat/', core_views.api_portal_chat, name='api_portal_chat'),

    # Static file serving for /static/, /styles/ and /js/
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.BASE_DIR / 'static'}),
    re_path(r'^styles/(?P<path>.*)$', serve, {'document_root': settings.BASE_DIR / 'static/styles'}),
    re_path(r'^js/(?P<path>.*)$', serve, {'document_root': settings.BASE_DIR / 'static/js'}),

    # App Portal Routes
    path('student-portal/', include('student_portal.urls')),
    path('client-portal/', include('client_portal.urls')),
    path('admin-portal/', include('admin_portal.urls')),

    # Core Pages
    path('', include('core.urls')),
]
