from django.db import models

class SystemActivityLog(models.Model):
    SEVERITY_CHOICES = [
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    ]

    action_type = models.CharField(max_length=100) # DEPLOY_SUCCESS, CLIENT_REQUIREMENT, LMS_ASSIGNMENT
    title = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='info')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'System Activity Log'
        verbose_name_plural = 'System Activity Logs'

    def __str__(self):
        return f"[{self.action_type}] {self.title}"


class PlatformMetricsSnapshot(models.Model):
    total_students = models.IntegerField(default=2418)
    active_enterprise_clients = models.IntegerField(default=18)
    monthly_arr = models.CharField(max_length=50, default='$148,000')
    cluster_uptime = models.CharField(max_length=20, default='99.99%')
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_at']
        verbose_name = 'Platform Metrics Snapshot'
        verbose_name_plural = 'Platform Metrics Snapshots'

    def __str__(self):
        return f"Metrics @ {self.recorded_at.strftime('%Y-%m-%d %H:%M')}"
