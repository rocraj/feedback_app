# Feedback App

## 🌐 Live Demo: [https://feedback-mini.web.app](https://feedback-mini.web.app)

> **Note:** The live demo requires the backend to be running locally. Please follow the [Installation](#installation) instructions to set up the backend server before testing the demo. Backend deployment to a cloud service is planned for future releases.

A modern, full-stack feedback management system built with **React (Vite + TypeScript)** on the frontend and **FastAPI (Python)** on the backend, storing data in **PostgreSQL**. The application provides a clean, professional interface for submitting and viewing feedback, with multiple authentication options including Magic Links for secure, frictionless user experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Folder Structure](#folder-structure)  
- [Database Design](#database-design)  
- [Authentication Versions](#authentication-versions)  
- [Admin Console](#admin-console)  
- [Scripts](#scripts)  
- [Containerization](#containerization)  
- [Future Enhancements](#future-enhancements)  
- [License](#license)  

---

## Features

### Core Functionality
- **User-friendly feedback submission form** with validation
- **Interactive feedback listing** with sorting and filtering
- **Multiple authentication options** (Magic Links, JWT, Anonymous)
- **Admin dashboard** with statistics and feedback management
- **Responsive design** for mobile and desktop users

### Authentication & Security
- **Magic Link authentication** for frictionless user experience
- **JWT token-based authentication** for traditional login
- **Anonymous submissions** with email verification
- **CORS protection** and secure API endpoints
- **Input validation** and sanitization throughout

### User Experience
- **Clean, modern interface** with professional styling
- **Sorting and filtering** capabilities for feedback list
- **Responsive design** adapts to all screen sizes
- **Optimistic UI updates** for better perceived performance
- **Form validation** with clear error messaging

### Admin Features
- **Feedback analytics** with visualization
- **User management** dashboard
- **Export capabilities** for data analysis

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Axios** for API requests
- **SCSS** for component styling

### Backend
- **FastAPI** for high-performance API endpoints
- **SQLAlchemy** for ORM database interactions
- **Pydantic** for data validation
- **Alembic** for database migrations
- **JWT** and custom auth implementations

### Database & Storage
- **PostgreSQL** for relational data storage
- **SQLAlchemy** for database interactions

### Development & Deployment
- **Docker/Podman** for containerization
- **Shell scripts** for automation
- **GitHub** for version control
- **FastAPI SwaggerUI** for API documentation

---

## Recent Updates

### Magic Link Authentication
- Implemented secure, time-limited magic links sent via email for frictionless authentication
- Enhanced security with one-time use tokens and expiration management
- Streamlined user experience with fewer steps to authenticate

### UI/UX Improvements
- Redesigned feedback list with sorting and filtering capabilities
- Enhanced form validation with real-time feedback
- Improved responsive design for better mobile experience
- Optimistic UI updates for snappier interactions

### Security Enhancements
- Strengthened token validation for Magic Links
- Improved CORS configuration and security headers
- Enhanced input validation and sanitization

### Performance Optimizations
- Reduced API payload sizes for faster loading
- Improved database query performance
- Better state management on frontend

---

## Installation

### Prerequisites

- Node.js >= 18  
- Python >= 3.11  
- PostgreSQL >= 14  
- Podman or Docker  

### Clone Repository

```bash
git clone https://github.com/rocraj/feedback_app.git
cd feedback_app
```

### Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Setup Frontend

```bash
cd frontend
npm install
```

## Folder Structure

```bash
feedback_app/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── feedback_routes/
│   │   │   │   │   ├── feedback_keycloak.py
│   │   │   │   │   ├── feedback_jwt.py
│   │   │   │   │   ├── feedback_captcha.py
│   │   │   │   │   └── feedback_magic_link.py
│   │   │   │   ├── auth_routes/
│   │   │   │   │   ├── auth_keycloak.py
│   │   │   │   │   ├── auth_jwt.py
│   │   │   │   │   └── auth_magic_link.py
│   │   │   │   ├── admin_routes/
│   │   │   │   │   └── admin_summary.py
│   │   │   │   └── router.py
│   │   │   └── __init__.py
│   │   ├── core/
│   │   │   ├── config.py             # POPULATED
│   │   │   ├── security.py
│   │   │   └── auth_version.py
│   │   ├── crud/
│   │   │   ├── feedback.py
│   │   │   ├── user.py
│   │   │   └── magic_link.py
│   │   ├── db/
│   │   │   ├── base.py               # POPULATED (Base model class)
│   │   │   ├── session.py            # POPULATED (Engine and session dependency)
│   │   │   ├── init_db.py            # POPULATED (Table creation function)
│   │   │   └── models/
│   │   │       ├── feedback.py
│   │   │       ├── user.py
│   │   │       └── magic_link.py
│   │   ├── schemas/
│   │   │   ├── feedback.py
│   │   │   ├── user.py
│   │   │   └── magic_link.py
│   │   ├── services/
│   │   │   ├── keycloak_service.py
│   │   │   ├── jwt_service.py
│   │   │   ├── captcha_service.py
│   │   │   └── magic_link_service.py
│   │   ├── utils/
│   │   │   ├── email_utils.py        # POPULATED
│   │   │   └── common.py             # POPULATED
│   │   ├── main.py
│   │   └── __init__.py
│   ├── Dockerfile                      # POPULATED
│   ├── requirements.txt                # POPULATED
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── feedbackApi.ts
│   │   ├── components/
│   │   │   ├── FeedbackForm.tsx
│   │   │   ├── FeedbackList.tsx
│   │   │   └── AdminSummary.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── Admin.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   ├── utils/
│   │   │   └── validators.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── infra/
│   └── db-init.sql                   # POPULATED
│
├── bin/
│   ├── start-db.sh                   # POPULATED
│   ├── start-backend.sh              # POPULATED
│   ├── build-frontend.sh
│   ├── start-frontend.sh
│   └── start-all.sh                  # POPULATED
│
├── .env                              # POPULATED
├── podman-compose.yaml               # POPULATED
└── README.md
```

## Database Design

### Users Table

| Column          | Type        | Description                        |
|-----------------|------------|------------------------------------|
| id              | UUID (PK)  | Unique user ID                     |
| first_name      | VARCHAR    | First name                         |
| last_name       | VARCHAR    | Last name                          |
| email           | VARCHAR    | Unique email                       |
| mobile          | VARCHAR    | Optional mobile number             |
| hashed_password | VARCHAR    | Hashed password for JWT auth       |
| oauth_provider  | VARCHAR    | OAuth2 provider                    |
| oauth_sub       | VARCHAR    | OAuth2 subject ID                  |
| created_at      | TIMESTAMP  | Account creation timestamp         |
| updated_at      | TIMESTAMP  | Last account update timestamp      |

### Feedback Table

| Column           | Type        | Description                          |
|-----------------|------------|--------------------------------------|
| id               | UUID (PK)  | Unique feedback ID                   |
| user_id          | UUID (FK)  | References `Users.id` (nullable)    |
| first_name       | VARCHAR    | Feedback submitter first name        |
| last_name        | VARCHAR    | Feedback submitter last name         |
| email            | VARCHAR    | Email used to restrict duplicates    |
| mobile           | VARCHAR    | Optional                             |
| rating           | INT        | Rating 1–5                           |
| feedback         | TEXT       | Feedback content                     |
| submission_count | INT        | Number of edits allowed (max 1)     |
| created_at       | TIMESTAMP  | Submission timestamp                 |
| updated_at       | TIMESTAMP  | Last edit timestamp                  |

---

### Magic Links Table

| Column      | Type       | Description                                         |
|--------------|-----------|-----------------------------------------------------|
| id           | UUID (PK)  | Unique magic link identifier                       |
| email        | VARCHAR    | Recipient's email address                          |
| secret_token | VARCHAR    | Secure token for validation                        |
| created_at   | TIMESTAMP  | Creation time                                      |
| expires_at   | TIMESTAMP  | Link expiration time (24 hours after creation)     |
| used         | BOOLEAN    | Whether the link has been used                     |

---

### CAPTCHA Verification Table

| Column        | Type        | Description                                         |
|----------------|------------|-----------------------------------------------------|
| token          | VARCHAR PK | CAPTCHA token received from frontend (e.g., reCAPTCHA) |
| created_at     | TIMESTAMP  | Timestamp when CAPTCHA token was received          |
| verified       | BOOLEAN    | Indicates whether CAPTCHA was successfully verified |
| ip_address     | VARCHAR    | (Optional) Client IP for extra validation/logging   |
| expires_at     | TIMESTAMP  | Expiry timestamp for CAPTCHA token validity (e.g., 2 minutes) |

---

**Note:**  
- CAPTCHA tokens and Magic Link tokens are **stored in temporary tables**, used only for verification before feedback insertion.  
- Once verification is complete, the verified status is updated or the entry is deleted for security.  
- This approach ensures the **Feedback table remains clean** and only contains verified submissions.

## Authentication Versions

| Version | Auth Mechanism        | Features / Restrictions                  |
|---------|---------------------|-----------------------------------------|
| V1      | Keycloak / OAuth2    | Submit feedback, edit once              |
| V2      | JWT Bearer tokens    | Signup/login, submit feedback, edit once|
| V3      | Anonymous + CAPTCHA  | 1 submission per email                   |
| V4      | Magic Link via Email | 1 submission per magic link, secure token in URL |


## Admin Console

- Dashboard displays **summary of feedbacks** by rating ranges:
  - 1–2 stars  
  - 2–3 stars  
  - 3–4 stars  
  - 4–5 stars  
  - 5 stars  

- **Future goal:** AI-based semantic analysis to summarize feedback content.

---

## Scripts

| Script                  | Description                                   |
|-------------------------|-----------------------------------------------|
| `start-db.sh`           | Start PostgreSQL database                      |
| `start-backend.sh`      | Start FastAPI backend                          |
| `build-frontend.sh`     | Build React frontend                           |
| `start-frontend.sh`     | Serve frontend locally                         |
| `start-all.sh`          | Sequentially start DB → backend → frontend    |

---

## Containerization

- All services are **containerized with Podman/Docker**  
- `docker-compose.yml` or `podman-compose.yml` sets up:
  - PostgreSQL  
  - Backend (FastAPI)  
  - Frontend (React Vite)  
- Easy deployment for development or production environments

---

## Future Enhancements 

- Semantic analysis with AI to summarize feedback  
- Export dashboard to CSV/Excel  
- Multi-tenant support  
- Analytics & visual charts per rating

## License

© 2025 Demo Company | Developed by Mahesh Raju

This project is a personal exercise developed by Sri Mahesh Durga Raju.


This project is licensed under the **MIT License**, which allows you to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided that the original copyright notice and this permission notice are included in all copies or substantial portions of the software.

For more details, see the [MIT License](https://opensource.org/licenses/MIT).