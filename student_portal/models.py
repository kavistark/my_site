from django.db import models
from django.contrib.auth.models import User

class StudentCourseEnrollment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active In Progress'),
        ('completed', 'Completed & Certified'),
        ('paused', 'Paused'),
    ]

    student = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='course_enrollments')
    student_name = models.CharField(max_length=150)
    student_email = models.EmailField()
    course_title = models.CharField(max_length=200, default='Generative AI with Python & Autonomous Agents')
    course_slug = models.SlugField(max_length=100, default='generative-ai-python')
    progress_percentage = models.IntegerField(default=84) # 0-100%
    current_module = models.CharField(max_length=200, default='Module 7: Multi-Agent Tool Calling with LangGraph')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    certificate_issued = models.BooleanField(default=False)
    certificate_url = models.CharField(max_length=255, blank=True)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-enrolled_at']
        verbose_name = 'Student Course Enrollment'
        verbose_name_plural = 'Student Course Enrollments'

    def __str__(self):
        return f"{self.student_name} - {self.course_title} ({self.progress_percentage}%)"


class StudentAssignment(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted (Tests Pending)'),
        ('graded', 'Graded & Approved'),
        ('revision_needed', 'Revision Requested'),
    ]

    enrollment = models.ForeignKey(StudentCourseEnrollment, on_delete=models.CASCADE, null=True, blank=True, related_name='assignments')
    student_email = models.EmailField()
    assignment_title = models.CharField(max_length=200, default='Capstone: Private RAG Vector Index Pipeline')
    github_repo_url = models.URLField(max_length=300)
    grade_score = models.IntegerField(default=100)
    mentor_feedback = models.TextField(blank=True, default='Excellent AST implementation, clean docstrings, all 9 test suites passing.')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='graded')
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Student Assignment'
        verbose_name_plural = 'Student Assignments'

    def __str__(self):
        return f"{self.assignment_title} - {self.student_email}"


class StudentMentorChatMessage(models.Model):
    SENDER_CHOICES = [
        ('student', 'Student'),
        ('mentor', 'Academy Mentor'),
    ]

    student_email = models.EmailField()
    sender_type = models.CharField(max_length=20, choices=SENDER_CHOICES, default='student')
    sender_name = models.CharField(max_length=150, default='Student')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Student-Mentor Message'
        verbose_name_plural = 'Student-Mentor Messages'

    def __str__(self):
        return f"[{self.sender_name}] {self.message[:30]}"
