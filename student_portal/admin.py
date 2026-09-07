from django.contrib import admin
from .models import StudentCourseEnrollment, StudentAssignment, StudentMentorChatMessage

@admin.register(StudentCourseEnrollment)
class StudentCourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'student_email', 'course_title', 'progress_percentage', 'status', 'enrolled_at')
    list_filter = ('status', 'course_title', 'enrolled_at')
    search_fields = ('student_name', 'student_email', 'course_title')
    list_editable = ('progress_percentage', 'status')

@admin.register(StudentAssignment)
class StudentAssignmentAdmin(admin.ModelAdmin):
    list_display = ('assignment_title', 'student_email', 'grade_score', 'status', 'submitted_at')
    list_filter = ('status', 'submitted_at')
    search_fields = ('assignment_title', 'student_email', 'github_repo_url')
    list_editable = ('grade_score', 'status')

@admin.register(StudentMentorChatMessage)
class StudentMentorChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender_name', 'sender_type', 'student_email', 'message', 'created_at')
    list_filter = ('sender_type', 'created_at')
    search_fields = ('sender_name', 'student_email', 'message')
