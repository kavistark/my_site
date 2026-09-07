from django.db import models

class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ('new', 'New Inquiry'),
        ('in_review', 'In Review'),
        ('contacted', 'Contacted / Meeting Scheduled'),
        ('closed', 'Closed / Archived'),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, null=True)
    company = models.CharField(max_length=150, blank=True, null=True)
    interest_service = models.CharField(max_length=100, blank=True, default='General Inquiry')
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Inquiry'
        verbose_name_plural = 'Contact Inquiries'

    def __str__(self):
        return f"{self.name} - {self.interest_service} ({self.created_at.strftime('%Y-%m-%d')})"


class CourseEnrollment(models.Model):
    PLAN_CHOICES = [
        ('self_paced', 'Self-Paced Learning'),
        ('live_cohort', 'Live Mentorship Cohort'),
        ('enterprise', 'Enterprise Team Training'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('confirmed', 'Confirmed & Enrolled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    student_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, null=True)
    course_id = models.CharField(max_length=100)
    course_title = models.CharField(max_length=200)
    plan_type = models.CharField(max_length=50, choices=PLAN_CHOICES, default='live_cohort')
    experience_level = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Course Enrollment'
        verbose_name_plural = 'Course Enrollments'

    def __str__(self):
        return f"{self.student_name} -> {self.course_title} ({self.status})"


class QuoteRequest(models.Model):
    client_name = models.CharField(max_length=150)
    email = models.EmailField()
    company = models.CharField(max_length=150, blank=True, null=True)
    project_type = models.CharField(max_length=100)
    timeline = models.CharField(max_length=100, blank=True)
    selected_features = models.JSONField(default=list, blank=True)
    estimated_cost_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    estimated_cost_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    project_details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Quote Request'
        verbose_name_plural = 'Quote Requests'

    def __str__(self):
        return f"Quote for {self.client_name} - {self.project_type}"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    source = models.CharField(max_length=100, default='footer')
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'

    def __str__(self):
        return self.email


class LiveClassRegistration(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    session_id = models.CharField(max_length=100)
    session_title = models.CharField(max_length=200)
    session_date = models.CharField(max_length=100, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-registered_at']
        verbose_name = 'Live Class Registration'
        verbose_name_plural = 'Live Class Registrations'

    def __str__(self):
        return f"{self.name} - {self.session_title}"


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student / Learner'),
        ('client', 'Enterprise Client'),
        ('admin', 'System Administrator'),
    ]

    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=50, blank=True, null=True)
    company = models.CharField(max_length=150, blank=True, null=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"


class ProjectRequirement(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Requirement Submitted'),
        ('scoping', 'Architecture Scoping'),
        ('in_development', 'In Active Sprint'),
        ('qa_testing', 'QA & Staging Review'),
        ('deployed', 'Production Deployed'),
    ]
    PRIORITY_CHOICES = [
        ('standard', 'Standard'),
        ('high', 'High Priority'),
        ('urgent', 'Urgent / Critical'),
    ]

    project_name = models.CharField(max_length=200)
    client_name = models.CharField(max_length=150)
    client_email = models.EmailField()
    company = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=100, default='Custom Software')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='standard')
    description = models.TextField()
    timeline = models.CharField(max_length=100, blank=True, default='4-6 weeks')
    budget_estimate = models.CharField(max_length=100, blank=True, default='$5,000 - $10,000')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='in_development')
    sprint_progress = models.IntegerField(default=65)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project Requirement'
        verbose_name_plural = 'Project Requirements'

    def __str__(self):
        return f"{self.project_name} ({self.client_name})"


class PortalMessage(models.Model):
    sender_type = models.CharField(max_length=20, default='client') # 'client', 'admin', 'student'
    sender_name = models.CharField(max_length=150, default='Client')
    channel = models.CharField(max_length=50, default='client_admin_chat')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Portal Message'
        verbose_name_plural = 'Portal Messages'

    def __str__(self):
        return f"[{self.sender_name}] {self.message[:30]}"

