# Feedback App

A full-stack feedback management system built with **React (Vite)** on the frontend and **FastAPI** on the backend, storing data in **PostgreSQL**. The app allows users to submit feedback, view submitted feedback, and provides an admin dashboard for summarizing responses. The application is fully containerized for easy development and deployment.

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

- User-friendly **feedback submission form**  
- Display all submitted feedback below the form  
- Support for **authenticated and anonymous submissions**  
- Submission restrictions (edit only once per feedback/email)  
- CAPTCHA or OTP for anonymous users  
- Admin dashboard with **summary by rating ranges**  
- Containerized environment for development and deployment  
- Swagger UI for API exploration and testing  

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite  
- **Backend:** FastAPI, Python 3.11+, Uvicorn  
- **Database:** PostgreSQL  
- **Authentication:**  
  - Version 1: Keycloak / OAuth2  
  - Version 2: JWT Bearer tokens  
  - Version 3: Anonymous + CAPTCHA  
  - Version 4: Anonymous + OTP  
- **Containerization:** Podman / Docker  
- **Styling:** Custom SCSS (dark professional credential theme)  

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

````
### Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

````
### Setup Frontend

```bash
cd frontend
npm install

````

## Folder Structure

```bash
feedback-project/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── feedback_routes/
│   │   │   │   │   ├── feedback_keycloak.py
│   │   │   │   │   ├── feedback_jwt.py
│   │   │   │   │   ├── feedback_captcha.py
│   │   │   │   │   └── feedback_otp.py
│   │   │   │   ├── auth_routes/
│   │   │   │   │   ├── auth_keycloak.py
│   │   │   │   │   ├── auth_jwt.py
│   │   │   │   │   └── auth_otp.py
│   │   │   │   ├── admin_routes/
│   │   │   │   │   └── admin_summary.py
│   │   │   │   └── router.py
│   │   │   └── __init__.py
│   │   ├── core/
│   │   │   ├── config.py             # POPULATED
│   │   │   ├── security.py
│   │   │   └── auth_version.py
│   │   ├── crud/
│   │   │   ├── feedback.py
│   │   │   ├── user.py
│   │   │   └── otp.py
│   │   ├── db/
│   │   │   ├── base.py               # POPULATED (Base model class)
│   │   │   ├── session.py            # POPULATED (Engine and session dependency)
│   │   │   ├── init_db.py            # POPULATED (Table creation function)
│   │   │   └── models/
│   │   │       ├── feedback.py
│   │   │       ├── user.py
│   │   │       └── otp.py
│   │   ├── schemas/
│   │   │   ├── feedback.py
│   │   │   ├── user.py
│   │   │   └── otp.py
│   │   ├── services/
│   │   │   ├── keycloak_service.py
│   │   │   ├── jwt_service.py
│   │   │   ├── captcha_service.py
│   │   │   └── otp_service.py
│   │   ├── utils/
│   │   │   ├── email_utils.py        # POPULATED
│   │   │   └── common.py             # POPULATED
│   │   ├── main.py
│   │   └── __init__.py
│   ├── Dockerfile                      # POPULATED
│   ├── requirements.txt                # POPULATED
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── feedbackApi.ts
│   │   ├── components/
│   │   │   ├── FeedbackForm.tsx
│   │   │   ├── FeedbackList.tsx
│   │   │   └── AdminSummary.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── Admin.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   ├── utils/
│   │   │   └── validators.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── infra/
│   └── db-init.sql                   # POPULATED
│
├── bin/
│   ├── start-db.sh                   # POPULATED
│   ├── start-backend.sh              # POPULATED
│   ├── build-frontend.sh
│   ├── start-frontend.sh
│   └── start-all.sh                  # POPULATED
│
├── .env                              # POPULATED
├── podman-compose.yaml               # POPULATED
└── README.md

````


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
| captcha_token    | VARCHAR    | Stores CAPTCHA token (V3)           |
| otp_code         | VARCHAR    | Stores OTP for anonymous submissions |
| submission_count | INT        | Number of edits allowed (max 1)     |
| created_at       | TIMESTAMP  | Submission timestamp                 |
| updated_at       | TIMESTAMP  | Last edit timestamp                  |

---

## Authentication Versions

| Version | Auth Mechanism        | Features / Restrictions                  |
|---------|---------------------|-----------------------------------------|
| V1      | Keycloak / OAuth2    | Submit feedback, edit once              |
| V2      | JWT Bearer tokens    | Signup/login, submit feedback, edit once|
| V3      | Anonymous + CAPTCHA  | 1 submission per email                   |
| V4      | Anonymous + OTP      | 1 submission and 1 edit per email       |


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

