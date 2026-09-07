# Nconix - Enterprise Software, AI Solutions & Academy Platform

Nconix is an enterprise technology and training platform powered by a **Django + Django REST Framework** backend.

## Tech Stack
- **Backend Framework**: Python 3.14 + Django 6.0 + Django REST Framework 3.18
- **Database**: SQLite3 (`db.sqlite3`)
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 Design System
- **API Endpoints**: RESTful endpoints for Contact, Enrollments, Quotes, and Newsletter.

---

## Quickstart

### 1. Apply Database Migrations
```bash
python manage.py migrate
```

### 2. (Optional) Create Superuser for Django Admin
```bash
python manage.py createsuperuser
```

### 3. Run the Development Server
```bash
python manage.py runserver 8000
```

Access the application in your browser:
- **Web Platform**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Django Admin Panel**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- **REST API Root**: [http://127.0.0.1:8000/api/stats/](http://127.0.0.1:8000/api/stats/)

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contact/` | Submit contact & consultation inquiries |
| `POST` | `/api/enroll/` | Register for Academy courses & cohorts |
| `POST` | `/api/quote/` | Save project estimate calculations |
| `POST` | `/api/newsletter/` | Subscribe to newsletter |
| `POST` | `/api/live-class-register/` | Book seat in upcoming live webinars & cohorts |
| `GET` | `/api/stats/` | Retrieve platform statistics |

---

## Running Tests
```bash
python manage.py test core
```
