from django.shortcuts import render
from django.http import Http404, HttpResponse
from pathlib import Path
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import ContactMessage, CourseEnrollment, QuoteRequest, NewsletterSubscriber, LiveClassRegistration
from .serializers import (
    ContactMessageSerializer,
    CourseEnrollmentSerializer,
    QuoteRequestSerializer,
    NewsletterSubscriberSerializer,
    LiveClassRegistrationSerializer,
)

# -----------------------------------------------------------------------------
# PAGE VIEWS
# -----------------------------------------------------------------------------

VALID_PAGES = {
    'index': 'index.html',
    'about': 'about.html',
    'academy': 'academy.html',
    'ai-solutions': 'ai-solutions.html',
    'blog': 'blog.html',
    'clients': 'clients.html',
    'community': 'community.html',
    'contact': 'contact.html',
    'live-classes': 'live-classes.html',
    'portals': 'portals.html',
    'client-portal': 'client-portal.html',
    'student-portal': 'student-portal.html',
    'login': 'login.html',
    'register': 'register.html',
    'projects': 'projects.html',
    'reviews': 'reviews.html',
    'services': 'services.html',
}

def page_view(request, page_name='index'):
    """Renders HTML template pages, supporting both clean paths and .html extensions."""
    # Strip trailing .html if present
    normalized_name = page_name.replace('.html', '').strip('/')
    if not normalized_name:
        normalized_name = 'index'

    template_file = VALID_PAGES.get(normalized_name)
    if not template_file:
        raise Http404(f"Page '{page_name}' not found on Nconix platform.")

    return render(request, template_file, {
        'page_name': normalized_name,
        'app_title': 'Nconix | Building Software. Powering AI. Developing Skills.'
    })


# -----------------------------------------------------------------------------
# REST API ENDPOINTS
# -----------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def api_contact(request):
    """Handle contact and consultation form submissions."""
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({
            'success': True,
            'message': f"Thank you, {instance.name}! Your message has been received. Our team will contact you within 24 hours.",
            'inquiry_id': instance.id,
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_enroll(request):
    """Handle academy course enrollments."""
    serializer = CourseEnrollmentSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({
            'success': True,
            'message': f"Enrollment confirmed for {instance.student_name} in {instance.course_title}! Confirmation details have been logged.",
            'enrollment_id': instance.id,
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_quote(request):
    """Save custom project estimates and lead information."""
    serializer = QuoteRequestSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({
            'success': True,
            'message': f"Project estimate for {instance.project_type} successfully recorded. A solution architect will reach out shortly.",
            'quote_id': instance.id,
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_newsletter(request):
    """Subscribe user to technical newsletter."""
    email = request.data.get('email', '').strip()
    source = request.data.get('source', 'website')
    
    if not email:
        return Response({'success': False, 'message': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    subscriber, created = NewsletterSubscriber.objects.get_or_create(
        email=email,
        defaults={'source': source, 'is_active': True}
    )
    
    if not created and not subscriber.is_active:
        subscriber.is_active = True
        subscriber.save()

    return Response({
        'success': True,
        'message': 'You have successfully subscribed to Nconix AI & Tech updates!',
        'created': created
    }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_live_class_register(request):
    """Register for upcoming live online sessions."""
    serializer = LiveClassRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({
            'success': True,
            'message': f"Successfully registered for {instance.session_title}!",
            'registration_id': instance.id,
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_stats(request):
    """Return live platform stats."""
    return Response({
        'status': 'healthy',
        'platform': 'Nconix Django Backend',
        'metrics': {
            'students_enrolled': CourseEnrollment.objects.count() + 1850,
            'quotes_requested': QuoteRequest.objects.count() + 140,
            'inquiries_processed': ContactMessage.objects.count() + 320,
            'newsletter_subscribers': NewsletterSubscriber.objects.filter(is_active=True).count() + 4500,
        }
    })


# -----------------------------------------------------------------------------
# AUTHENTICATION API ENDPOINTS
# -----------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    """Register a new user account with role-based profile."""
    from django.contrib.auth.models import User
    from django.contrib.auth import login
    from .models import UserProfile

    data = request.data
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    name = data.get('name', '').strip()
    role = data.get('role', 'student').strip().lower()
    company = data.get('company', '').strip()
    phone = data.get('phone', '').strip()

    if not username:
        username = email.split('@')[0] if email else ''

    if not email or not password:
        return Response({
            'success': False,
            'message': 'Email and password are required.'
        }, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 6:
        return Response({
            'success': False,
            'message': 'Password must be at least 6 characters long.'
        }, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({
            'success': False,
            'message': 'An account with this email already exists. Please log in.'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Ensure unique clean username
    base_username = username.strip() if username else email.split('@')[0].replace('.', '_').replace('-', '_')
    if not base_username:
        base_username = 'user'
    final_username = base_username
    counter = 1
    while User.objects.filter(username__iexact=final_username).exists():
        final_username = f"{base_username}{counter}"
        counter += 1

    first_name = name.split(' ')[0] if name else ''
    last_name = ' '.join(name.split(' ')[1:]) if len(name.split(' ')) > 1 else ''

    user = User.objects.create_user(
        username=final_username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    if role not in ['student', 'client', 'admin']:
        role = 'student'

    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={'role': role, 'company': company, 'phone': phone}
    )

    login(request, user)

    redirect_target = '/client-portal.html' if profile.role == 'client' else '/student-portal.html' if profile.role == 'student' else '/portals.html?role=admin'

    return Response({
        'success': True,
        'message': f"Account successfully created for {user.get_full_name() or user.username}!",
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': user.get_full_name() or user.username,
            'role': profile.role,
            'company': profile.company,
        },
        'redirect_url': redirect_target
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """Authenticate a user via username or email."""
    from django.contrib.auth.models import User
    from django.contrib.auth import authenticate, login

    data = request.data
    login_id = data.get('username', '').strip() or data.get('email', '').strip()
    password = data.get('password', '').strip()
    requested_role = data.get('role', '').strip().lower()

    if not login_id or not password:
        return Response({
            'success': False,
            'message': 'Please provide both username/email and password.'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Resolve email to username if an email was supplied
    username_to_auth = login_id
    if '@' in login_id:
        try:
            user_obj = User.objects.get(email__iexact=login_id)
            username_to_auth = user_obj.username
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'No account found with this email address.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except User.MultipleObjectsReturned:
            user_obj = User.objects.filter(email__iexact=login_id).first()
            username_to_auth = user_obj.username

    user = authenticate(request, username=username_to_auth, password=password)

    if user is not None:
        if not user.is_active:
            return Response({
                'success': False,
                'message': 'This account has been deactivated.'
            }, status=status.HTTP_403_FORBIDDEN)

        login(request, user)

        role = 'student'
        if hasattr(user, 'profile'):
            role = user.profile.role
        elif user.is_staff or user.is_superuser:
            role = 'admin'

        if requested_role and requested_role in ['student', 'client', 'admin']:
            role = requested_role

        redirect_target = '/client-portal.html' if role == 'client' else '/student-portal.html' if role == 'student' else '/portals.html?role=admin'

        return Response({
            'success': True,
            'message': f"Welcome back, {user.get_full_name() or user.username}!",
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.get_full_name() or user.username,
                'role': role,
            },
            'redirect_url': redirect_target
        }, status=status.HTTP_200_OK)

    return Response({
        'success': False,
        'message': 'Invalid credentials. Please verify your password and try again.'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def api_logout(request):
    """Log out the current user, flush session, and instruct browser to clear cache & storage."""
    from django.contrib.auth import logout
    logout(request)
    if hasattr(request, 'session'):
        request.session.flush()
    
    response = Response({
        'success': True,
        'message': 'You have been logged out safely and cache cleared.'
    }, status=status.HTTP_200_OK)
    
    # Instruct browser to purge cache, cookies, and client storage on logout
    response['Clear-Site-Data'] = '"cache", "cookies", "storage"'
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_current_user(request):
    """Get the currently logged-in user profile."""
    if request.user.is_authenticated:
        role = 'student'
        company = ''
        if hasattr(request.user, 'profile'):
            role = request.user.profile.role
            company = request.user.profile.company or ''
        elif request.user.is_staff:
            role = 'admin'

        return Response({
            'is_authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'name': request.user.get_full_name() or request.user.username,
                'role': role,
                'company': company,
            }
        })

    return Response({
        'is_authenticated': False,
        'user': None
    })


# -----------------------------------------------------------------------------
# CLIENT & STUDENT PORTAL APIS
# -----------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def api_project_requirements(request):
    """Fetch and submit client project requirements."""
    from .models import ProjectRequirement
    from .serializers import ProjectRequirementSerializer

    if request.method == 'POST':
        serializer = ProjectRequirementSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({
                'success': True,
                'message': f"Project requirement '{instance.project_name}' submitted successfully! Our lead architect is scoping the technical sprint.",
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # GET
    requirements = ProjectRequirement.objects.all()
    if not requirements.exists():
        # Seed default project if empty
        ProjectRequirement.objects.create(
            project_name="Enterprise Private RAG Pipeline",
            client_name="Apex Global Tech",
            client_email="cto@apexglobal.com",
            company="Apex Logistics & AI",
            category="Enterprise RAG & AI Agents",
            priority="high",
            description="Multi-tenant document vectorization engine with LangChain and FAISS embeddings.",
            timeline="6 Weeks",
            budget_estimate="$8,500",
            status="in_development",
            sprint_progress=75
        )
        requirements = ProjectRequirement.objects.all()

    serializer = ProjectRequirementSerializer(requirements, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def api_portal_chat(request):
    """Interactive real-time message exchange between client, student, and admin portal."""
    from .models import PortalMessage
    from .serializers import PortalMessageSerializer

    channel = request.query_params.get('channel', 'client_admin_chat')

    if request.method == 'POST':
        serializer = PortalMessageSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            
            # If client sends a message, auto-respond with Architect acknowledgment if needed
            auto_reply = None
            if instance.sender_type == 'client' and 'urgent' in instance.message.lower():
                auto_reply = PortalMessage.objects.create(
                    sender_type='admin',
                    sender_name='Nconix Lead Architect (Bot / A. Sharma)',
                    channel=instance.channel,
                    message="High-priority notification received. I'm actively reviewing your commit logs and sprint milestone details."
                )

            return Response({
                'success': True,
                'message': 'Message sent successfully.',
                'data': serializer.data,
                'auto_reply': PortalMessageSerializer(auto_reply).data if auto_reply else None
            }, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # GET
    messages = PortalMessage.objects.filter(channel=channel)
    if not messages.exists():
        if channel == 'client_admin_chat':
            PortalMessage.objects.create(
                sender_type='admin',
                sender_name='Nconix Lead Architect (A. Sharma)',
                channel=channel,
                message="Hello! Welcome to the Nconix Enterprise Client Desk. Sprint 4 microservices are currently deployed on staging."
            )
            PortalMessage.objects.create(
                sender_type='client',
                sender_name='Client Lead',
                channel=channel,
                message="Thanks! We tested the document ingestion endpoint. Throughput looks solid."
            )
        elif channel == 'student_mentor_chat':
            PortalMessage.objects.create(
                sender_type='admin',
                sender_name='Academy Mentor (P. Verma)',
                channel=channel,
                message="Welcome to your live LMS cohort workspace! Let me know if you need any guidance on the LangChain FAISS assignment."
            )
        messages = PortalMessage.objects.filter(channel=channel)

    serializer = PortalMessageSerializer(messages, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })


