from django.contrib import admin
from .models import (
    ContactMessage,
    CourseEnrollment,
    QuoteRequest,
    NewsletterSubscriber,
    LiveClassRegistration,
    UserProfile,
    ProjectRequirement,
    PortalMessage,
)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'interest_service', 'company', 'status', 'created_at')
    list_filter = ('status', 'interest_service', 'created_at')
    search_fields = ('name', 'email', 'company', 'subject', 'message')
    list_editable = ('status',)
    readonly_fields = ('created_at',)


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'email', 'course_title', 'plan_type', 'status', 'created_at')
    list_filter = ('status', 'plan_type', 'course_title', 'created_at')
    search_fields = ('student_name', 'email', 'course_title', 'phone')
    list_editable = ('status',)
    readonly_fields = ('created_at',)


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'email', 'project_type', 'company', 'currency', 'created_at')
    list_filter = ('project_type', 'currency', 'created_at')
    search_fields = ('client_name', 'email', 'company', 'project_details')
    readonly_fields = ('created_at',)


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'source', 'is_active', 'subscribed_at')
    list_filter = ('is_active', 'source', 'subscribed_at')
    search_fields = ('email',)


@admin.register(LiveClassRegistration)
class LiveClassRegistrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'session_title', 'session_date', 'registered_at')
    list_filter = ('session_title', 'registered_at')
    search_fields = ('name', 'email', 'session_title')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'company', 'phone', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('user__username', 'user__email', 'company', 'phone')


@admin.register(ProjectRequirement)
class ProjectRequirementAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'client_name', 'company', 'priority', 'status', 'sprint_progress', 'created_at')
    list_filter = ('status', 'priority', 'created_at')
    search_fields = ('project_name', 'client_name', 'company', 'description')
    list_editable = ('status', 'sprint_progress')


@admin.register(PortalMessage)
class PortalMessageAdmin(admin.ModelAdmin):
    list_display = ('sender_name', 'sender_type', 'channel', 'message', 'created_at')
    list_filter = ('sender_type', 'channel', 'created_at')
    search_fields = ('sender_name', 'message')


