from django.test import TestCase, Client
import json

class NconixPlatformTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_pages_render_status_200(self):
        pages = [
            '/',
            '/about',
            '/about.html',
            '/academy',
            '/academy.html',
            '/ai-solutions',
            '/ai-solutions.html',
            '/blog',
            '/blog.html',
            '/clients',
            '/clients.html',
            '/community',
            '/community.html',
            '/contact',
            '/contact.html',
            '/live-classes',
            '/live-classes.html',
            '/portals',
            '/portals.html',
            '/client-portal',
            '/client-portal.html',
            '/client-portal/',
            '/student-portal',
            '/student-portal.html',
            '/student-portal/',
            '/admin-portal/',
            '/login',
            '/login.html',
            '/register',
            '/register.html',
            '/projects',
            '/projects.html',
            '/reviews',
            '/reviews.html',
            '/services',
            '/services.html',
        ]
        for url in pages:
            response = self.client.get(url)
            self.assertEqual(
                response.status_code, 200, 
                f"Failed to load page '{url}', status={response.status_code}"
            )

    def test_static_asset_serving(self):
        css_resp = self.client.get('/styles/main.css')
        self.assertEqual(css_resp.status_code, 200)
        
        js_resp = self.client.get('/js/app.js')
        self.assertEqual(js_resp.status_code, 200)

    def test_api_contact(self):
        payload = {
            'name': 'Test Engineer',
            'email': 'engineer@nconix.com',
            'company': 'Tech Corp',
            'interest_service': 'Enterprise AI & RAG',
            'subject': 'Enterprise Consultation',
            'message': 'We need a private RAG pipeline deployed on AWS.'
        }
        resp = self.client.post(
            '/api/contact/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertTrue(data['success'])

    def test_api_enroll(self):
        payload = {
            'student_name': 'Jane Doe',
            'email': 'jane@example.com',
            'phone': '+1234567890',
            'course_id': 'python-ai-agents',
            'course_title': 'Generative AI with Python & Autonomous Agents',
            'plan_type': 'live_cohort',
            'experience_level': 'Intermediate'
        }
        resp = self.client.post(
            '/api/enroll/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertTrue(data['success'])

    def test_api_quote(self):
        payload = {
            'client_name': 'Acme Corp Lead',
            'email': 'leads@acme.com',
            'company': 'Acme Global',
            'project_type': 'GENAI (mvp)',
            'timeline': '4-6 weeks',
            'selected_features': ['RAG', 'Agentic Workflows'],
            'currency': 'USD',
            'project_details': 'Calculated Estimate: $4,500'
        }
        resp = self.client.post(
            '/api/quote/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertTrue(data['success'])

    def test_api_newsletter(self):
        payload = {'email': 'subscriber@nconix.com', 'source': 'homepage'}
        resp = self.client.post(
            '/api/newsletter/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertIn(resp.status_code, [200, 201])
        data = resp.json()
        self.assertTrue(data['success'])

    def test_api_auth_register_and_login_flow(self):
        # 1. Register new user
        reg_payload = {
            'name': 'Sarah Connor',
            'email': 'sarah@skynet-defense.com',
            'password': 'SecurePassword123!',
            'role': 'client',
            'company': 'Cyberdyne Systems'
        }
        reg_resp = self.client.post(
            '/api/auth/register/',
            data=json.dumps(reg_payload),
            content_type='application/json'
        )
        self.assertEqual(reg_resp.status_code, 201)
        reg_data = reg_resp.json()
        self.assertTrue(reg_data['success'])
        self.assertEqual(reg_data['user']['role'], 'client')

        # 2. Check current user
        user_resp = self.client.get('/api/auth/user/')
        self.assertEqual(user_resp.status_code, 200)
        user_data = user_resp.json()
        self.assertTrue(user_data['is_authenticated'])
        self.assertEqual(user_data['user']['email'], 'sarah@skynet-defense.com')

        # 3. Logout
        logout_resp = self.client.post('/api/auth/logout/')
        self.assertEqual(logout_resp.status_code, 200)

        # 4. Login with registered email
        login_payload = {
            'username': 'sarah@skynet-defense.com',
            'password': 'SecurePassword123!'
        }
        login_resp = self.client.post(
            '/api/auth/login/',
            data=json.dumps(login_payload),
            content_type='application/json'
        )
        self.assertEqual(login_resp.status_code, 200)
        login_data = login_resp.json()
        self.assertTrue(login_data['success'])
        self.assertEqual(login_data['user']['role'], 'client')

    def test_api_auth_invalid_login(self):
        login_payload = {
            'username': 'nonexistent@user.com',
            'password': 'wrongpassword'
        }
        resp = self.client.post(
            '/api/auth/login/',
            data=json.dumps(login_payload),
            content_type='application/json'
        )
        self.assertEqual(resp.status_code, 401)
        data = resp.json()
        self.assertFalse(data['success'])

    def test_api_stats(self):
        resp = self.client.get('/api/stats/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('metrics', data)

    def test_api_portal_requirements_and_chat(self):
        # 1. Post new client requirement
        req_payload = {
            'project_name': 'Custom LLM Vector Search',
            'client_name': 'Client Tester',
            'client_email': 'tester@enterprise.com',
            'company': 'Enterprise AI Corp',
            'category': 'Enterprise RAG & AI',
            'priority': 'high',
            'timeline': '3 Weeks',
            'description': 'High-performance embedding search with latency under 10ms.'
        }
        req_resp = self.client.post(
            '/api/portal/requirements/',
            data=json.dumps(req_payload),
            content_type='application/json'
        )
        self.assertEqual(req_resp.status_code, 201)
        self.assertTrue(req_resp.json()['success'])

        # 2. Get requirements
        get_req_resp = self.client.get('/api/portal/requirements/')
        self.assertEqual(get_req_resp.status_code, 200)
        self.assertTrue(len(get_req_resp.json()['data']) >= 1)

        # 3. Post client chat message
        chat_payload = {
            'sender_type': 'client',
            'sender_name': 'Client Tester',
            'channel': 'client_admin_chat',
            'message': 'Can we schedule a staging sprint review tomorrow?'
        }
        chat_resp = self.client.post(
            '/api/portal/chat/',
            data=json.dumps(chat_payload),
            content_type='application/json'
        )
        self.assertEqual(chat_resp.status_code, 201)
        self.assertTrue(chat_resp.json()['success'])

        # 4. Get chat messages
        get_chat_resp = self.client.get('/api/portal/chat/?channel=client_admin_chat')
        self.assertEqual(get_chat_resp.status_code, 200)
        self.assertTrue(len(get_chat_resp.json()['data']) >= 1)

    def test_auth_logout_endpoint(self):
        """Test user logout flushes session and returns 200 OK."""
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])

        get_response = self.client.get('/api/auth/logout/')
        self.assertEqual(get_response.status_code, 200)
        self.assertTrue(get_response.json()['success'])


