from django.shortcuts import render

def admin_portal_dashboard(request):
    """Render the System Admin Analytics Hub using its individual app template."""
    return render(request, 'admin_portal/dashboard.html', {
        'page_name': 'admin-portal'
    })
