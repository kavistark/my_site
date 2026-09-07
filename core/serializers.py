from rest_framework import serializers
from .models import (
    ContactMessage,
    CourseEnrollment,
    QuoteRequest,
    NewsletterSubscriber,
    LiveClassRegistration,
    ProjectRequirement,
    PortalMessage,
)

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['id', 'status', 'created_at']


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = '__all__'
        read_only_fields = ['id', 'status', 'created_at']


class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'source', 'subscribed_at', 'is_active']
        read_only_fields = ['id', 'subscribed_at', 'is_active']


class LiveClassRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveClassRegistration
        fields = '__all__'
        read_only_fields = ['id', 'registered_at']


class ProjectRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRequirement
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class PortalMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalMessage
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

