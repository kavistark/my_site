from django.urls import path
from . import views

urlpatterns = [
    # Page routes
    path('', views.page_view, {'page_name': 'index'}, name='home'),
    path('<str:page_name>', views.page_view, name='page_view_direct'),
    path('<str:page_name>/', views.page_view, name='page_view_slash'),
]
