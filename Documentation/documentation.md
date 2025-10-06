# Feedback App – Database & Architecture Documentation

## 1. Overview

This application is a full-stack feedback management system with three main modules:

- **Frontend:** React (Vite) – user feedback form, feedback list, admin console.  
- **Backend:** FastAPI (Python) – REST API with full CRUD support, authentication, and validation.  
- **Database:** PostgreSQL – storing user feedback, authentication info, and logs.  

The application is containerized for development and production using **Podman/Docker**, with automated scripts for starting services.

---

## 2. Database Design

The database is designed to handle multiple versions of user submissions, authentication, and anonymous feedback. All tables include timestamps for auditing and future analytics.

### 2.1 Users Table

Stores authenticated users (Version 1 & 2) and their metadata.

| Column Name      | Type          | Description                           |
|-----------------|---------------|---------------------------------------|
| id               | UUID (PK)    | Unique user ID                        |
| first_name       | VARCHAR(50)  | User first name                        |
| last_name        | VARCHAR(50)  | User last name                         |
| email            | VARCHAR(100) | Unique email, used for login & anonymous check |
| mobile           | VARCHAR(20)  | Optional mobile number                 |
| hashed_password  | VARCHAR(255) | Hashed password for JWT auth           |
| oauth_provider   | VARCHAR(50)  | Provider name for Keycloak/OAuth2      |
| oauth_sub        | VARCHAR(255) | External OAuth2 subject ID            |
| created_at       | TIMESTAMP    | Account creation timestamp             |
| updated_at       | TIMESTAMP    | Last account update timestamp          |

**Constraints:**

- Unique email per user  
- Nullable `hashed_password` if user uses OAuth2

---

### 2.2 Feedback Table

Stores all feedback submissions (anonymous or authenticated).

| Column Name      | Type          | Description                           |
|-----------------|---------------|---------------------------------------|
| id               | UUID (PK)    | Unique feedback ID                     |
| user_id          | UUID (FK)    | References `Users.id`; nullable for anonymous feedback |
| first_name       | VARCHAR(50)  | Feedback submitter first name          |
| last_name        | VARCHAR(50)  | Feedback submitter last name           |
| email            | VARCHAR(100) | Email used to restrict duplicate submissions |
| mobile           | VARCHAR(20)  | Optional                               |
| rating           | INT          | Rating from 1–5                        |
| feedback         | TEXT         | Feedback content                        |
| captcha_token    | VARCHAR(255) | Stores CAPTCHA token (Version 3)       |
| otp_code         | VARCHAR(10)  | Stores OTP for anonymous submissions (Version 4) |
| submission_count | INT          | Number of edits allowed (1 edit max)   |
| created_at       | TIMESTAMP    | Submission timestamp                     |
| updated_at       | TIMESTAMP    | Last edit timestamp                      |

**Constraints:**

- Unique `(email, otp_code)` or `(email, user_id)` to prevent duplicate submissions  
- Rating must be an integer between 1–5

---

### 2.3 Admin Summary Table (Optional / Denormalized)

Precomputes rating summaries for fast admin dashboard rendering.

| Column Name     | Type          | Description                          |
|-----------------|---------------|--------------------------------------|
| id               | SERIAL (PK)  | Unique summary ID                     |
| rating_range     | VARCHAR(10)  | e.g., "1-2", "2-3", "3-4", "4-5", "5" |
| feedback_count   | INT          | Number of feedbacks in this range     |
| created_at       | TIMESTAMP    | Timestamp of aggregation              |

**Notes:** Updated by backend cron or trigger after new feedback

---

## 3. ER Diagram

**Users**  
```bash
+----------------+
| id (PK)        |
| first_name     |
| last_name      |
| email          |
| hashed_password|
| oauth_provider |
| oauth_sub      |
| created_at     |
| updated_at     |
+----------------+
````
**Feedback**  
```bash
+-----------------+
| id (PK)         |
| user_id (FK)    | --> Users.id
| first_name      |
| last_name       |
| email           |
| mobile          |
| rating          |
| feedback        |
| captcha_token   |
| otp_code        |
| submission_count|
| created_at      |
| updated_at      |
+-----------------+
````

**AdminSummary**  
```bash
+-----------------+
| id (PK)         |
| rating_range    |
| feedback_count  |
| created_at      |
+-----------------+

````

## 4. Containerization Strategy

Podman/Docker Compose with three services:

- PostgreSQL – database

- Backend – FastAPI app served via Uvicorn + Gunicorn

- Frontend – React + Vite dev server or production build


**bin/ scripts:**  

```bash 
start-db.sh       # start PostgreSQL container
start-backend.sh  # start FastAPI container
build-frontend.sh # build React production assets
start-frontend.sh # serve frontend
start-all.sh      # sequentially start DB → backend → frontend

````

**YAML Configuration:**  

Configures all services, networks, and volumes

Enables easy scaling in production


## 5. Authentication & Versions

| Version | Auth Mechanism      | Features / Restrictions                        |
| ------- | ------------------- | ---------------------------------------------- |
| V1      | Keycloak / OAuth2   | User can submit feedback, edit once            |
| V2      | JWT Bearer tokens   | Signup/login, submit feedback, edit once       |
| V3      | Anonymous + CAPTCHA | Feedback via email, restricted to 1 submission |
| V4      | Anonymous + OTP     | Feedback via email/OTP, 1 submission, 1 edit   |


**Notes:**

- submission_count column tracks edits

- CAPTCHA token or OTP ensures limited anonymous submissions

## Future Goals / Enhancements

AI-driven semantic analysis
- Automatically summarize feedback
- Generate insights per rating range

Admin dashboard
- Dashboard displays summary of feedbacks by rating ranges:

    - 1–2 stars
    - 2–3 stars
    - 3–4 stars
    - 4–5 stars
    - 5 stars
- Search, filter, and export feedback

Scalability
- Multi-tenant support
- Separate analytics DB for heavy reporting