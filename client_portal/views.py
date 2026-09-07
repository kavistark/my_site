from django.shortcuts import render

def client_portal_dashboard(request):
    """Render the dedicated Enterprise Client Portal using its individual app template."""
    return render(request, 'client_portal/dashboard.html', {
        'page_name': 'client-portal'
    })
