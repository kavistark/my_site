from django.db import models
from django.contrib.auth.models import User

class ClientProject(models.Model):
    STATUS_CHOICES = [
        ('scoping', 'Architecture Scoping'),
        ('active_sprint', 'Active Development Sprint'),
        ('qa_testing', 'QA & Staging Review'),
        ('deployed', 'Production Deployed'),
        ('maintenance', '24/7 SLA Maintenance'),
    ]
    PRIORITY_CHOICES = [
        ('standard', 'Standard Velocity'),
        ('high', 'High Priority'),
        ('urgent', 'Urgent / Blocker Resolution'),
    ]

    client = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='client_projects')
    project_name = models.CharField(max_length=200)
    company_name = models.CharField(max_length=150, blank=True)
    contact_email = models.EmailField()
    category = models.CharField(max_length=100, default='Enterprise RAG & AI')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='high')
    sprint_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='active_sprint')
    sprint_progress = models.IntegerField(default=75) # 0 to 100%
    staging_url = models.URLField(blank=True, default='https://staging.internal.nconix.com')
    architecture_doc_url = models.CharField(max_length=255, blank=True, default='/docs/architecture-spec.pdf')
    nda_signed = models.BooleanField(default=True)
    budget_estimate = models.CharField(max_length=100, blank=True, default='$8,500')
    timeline = models.CharField(max_length=100, blank=True, default='4-6 Weeks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Client Project'
        verbose_name_plural = 'Client Projects'

    def __str__(self):
        return f"{self.project_name} ({self.company_name or self.contact_email})"


class ClientRequirement(models.Model):
    project = models.ForeignKey(ClientProject, on_delete=models.CASCADE, null=True, blank=True, related_name='requirements')
    project_name = models.CharField(max_length=200)
    client_name = models.CharField(max_length=150)
    client_email = models.EmailField()
    company = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=100, default='Enterprise RAG & AI')
    priority = models.CharField(max_length=20, default='high')
    timeline = models.CharField(max_length=100, blank=True, default='4 Weeks')
    description = models.TextField()
    status = models.CharField(max_length=30, default='submitted')
    sprint_progress = models.IntegerField(default=15)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Client Requirement'
        verbose_name_plural = 'Client Requirements'

    def __str__(self):
        return f"{self.project_name} - {self.client_name}"


class ClientChatMessage(models.Model):
    SENDER_TYPES = [
        ('client', 'Client'),
        ('architect', 'Lead Architect'),
        ('admin', 'Admin'),
    ]

    project = models.ForeignKey(ClientProject, on_delete=models.CASCADE, null=True, blank=True, related_name='chat_messages')
    sender_type = models.CharField(max_length=20, choices=SENDER_TYPES, default='client')
    sender_name = models.CharField(max_length=150, default='Client Lead')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Client Chat Message'
        verbose_name_plural = 'Client Chat Messages'

    def __str__(self):
        return f"[{self.sender_name}] {self.message[:30]}"
