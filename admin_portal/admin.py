from django.contrib import admin
from .models import SystemActivityLog, PlatformMetricsSnapshot

@admin.register(SystemActivityLog)
class SystemActivityLogAdmin(admin.ModelAdmin):
    list_display = ('action_type', 'title', 'severity', 'created_at')
    list_filter = ('severity', 'action_type', 'created_at')
    search_fields = ('action_type', 'title', 'details')

@admin.register(PlatformMetricsSnapshot)
class PlatformMetricsSnapshotAdmin(admin.ModelAdmin):
    list_display = ('recorded_at', 'total_students', 'active_enterprise_clients', 'monthly_arr', 'cluster_uptime')
    readonly_fields = ('recorded_at',)
