from django.shortcuts import render

def student_portal_dashboard(request):
    """Render the dedicated Student LMS Academy Portal using its individual app template."""
    return render(request, 'student_portal/dashboard.html', {
        'page_name': 'student-portal'
    })
