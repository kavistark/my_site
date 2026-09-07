from django.contrib import admin
from .models import ClientProject, ClientRequirement, ClientChatMessage

@admin.register(ClientProject)
class ClientProjectAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'company_name', 'contact_email', 'priority', 'sprint_status', 'sprint_progress', 'created_at')
    list_filter = ('sprint_status', 'priority', 'created_at')
    search_fields = ('project_name', 'company_name', 'contact_email')
    list_editable = ('sprint_status', 'sprint_progress')

@admin.register(ClientRequirement)
class ClientRequirementAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'client_name', 'company', 'priority', 'status', 'created_at')
    list_filter = ('status', 'priority', 'created_at')
    search_fields = ('project_name', 'client_name', 'company', 'description')

@admin.register(ClientChatMessage)
class ClientChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender_name', 'sender_type', 'message', 'created_at')
    list_filter = ('sender_type', 'created_at')
    search_fields = ('sender_name', 'message')
