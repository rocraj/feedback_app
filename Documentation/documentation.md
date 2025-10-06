# Feedback App – Technical Documentation

## 1. Overview

This application is a full-stack feedback management system designed to collect, store, and analyze user feedback efficiently and securely.

### ### 5.1 Magic Link Authentication Flow

Magic Links provide a streamlined and user-friendly authentication method for anonymous users, allowing secure submission of feedback without requiring account creation.hitecture Components:

- **Frontend:** React 18 with TypeScript (Vite) – providing a responsive user interface with feedback form, interactive feedback list, and admin console
- **Backend:** FastAPI (Python) – high-performance REST API with comprehensive CRUD operations, multiple authentication methods, and data validation
- **Database:** PostgreSQL – robust relational database storing user feedback, authentication data, and system metadata
- **Authentication:** Multiple options including Magic Link, JWT tokens, and anonymous submission

The application is fully containerized using **Podman/Docker** for consistent development and production environments, with automated scripts for service orchestration.

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
| magic_link_id    | UUID         | References the magic link used for submission (Version 4) |
| submission_count | INT          | Number of edits allowed (1 edit max)   |
| created_at       | TIMESTAMP    | Submission timestamp                     |
| updated_at       | TIMESTAMP    | Last edit timestamp                      |

**Constraints:**

- Unique `(email, token)` or `(email, user_id)` to prevent duplicate submissions  
- Rating must be an integer between 1–5

---

### 2.3 Magic Links Table

Stores secure magic links for email-based feedback submission, providing a streamlined user authentication flow.

| Column Name     | Type          | Description                          |
|-----------------|---------------|--------------------------------------|
| id               | UUID (PK)    | Unique magic link ID                 |
| email            | VARCHAR(100) | Email the magic link was sent to     |
| secret_token     | VARCHAR(255) | Secure random token for validation   |
| created_at       | TIMESTAMP    | When the magic link was created      |
| expires_at       | TIMESTAMP    | When the magic link expires (24h)    |
| used             | BOOLEAN      | Whether the link has been used       |
| session_token    | VARCHAR(255) | Token issued after validation for API requests |
| ip_address       | VARCHAR(45)  | IP address of the requester (for security audit) |

**Implementation Notes:**
- Secret tokens are generated using `secrets.token_urlsafe(32)` for cryptographic security
- Tokens expire after 24 hours and are automatically purged after 48 hours
- Each magic link can only be used once for submitting feedback
- IP address logging helps prevent abuse of the magic link system

### 2.4 Admin Summary Table (Optional / Denormalized)

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
| submission_count|
| created_at      |
| updated_at      |
+-----------------+
````

**MagicLinks**  
```bash
+-----------------+
| id (PK)         |
| email           |
| secret_token    |
| created_at      |
| expires_at      |
| used            |
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
| V4      | Magic Link via Email| Feedback via secure one-time link with token   |

### 5.1 Magic Link Authentication Flow

Magic Links have replaced the OTP system as the primary authentication method for anonymous users, providing a more streamlined and user-friendly experience.

#### Flow Sequence:

1. **Request Phase:**
   - User enters their email address on the frontend
   - Frontend sends email to `/api/v1/magic-link/request-magic-link` endpoint
   - Backend generates a secure random token and stores it in `magic_links` table
   - Backend sends an email with a link containing the token to the user
   - Link format: `https://app-url.com/magic-link?token=<secure_token>`

2. **Validation Phase:**
   - User clicks the link in their email
   - Frontend extracts token from URL and sends to `/api/v1/magic-link/validate-magic-link` endpoint
   - Backend validates:
     - Token exists in database
     - Token has not been used before
     - Token has not expired (24 hour validity)
   - If valid, backend marks token as used and returns a session token
   - Frontend stores session token for subsequent API calls

3. **Submission Phase:**
   - User completes feedback form
   - Frontend submits to `/api/v1/magic-link/feedback` endpoint with session token
   - Backend associates feedback with the validated magic link
   - Prevents duplicate submissions with the same magic link

#### Security Considerations:

- Tokens are cryptographically secure random strings (at least 32 bytes)
- All tokens have a 24-hour expiration period
- Single-use tokens prevent replay attacks
- Database entries are cleaned up by scheduled task after expiration

#### Sequence Diagram:
```
┌──────┐          ┌────────┐          ┌────────┐          ┌────────┐
│ User │          │Frontend│          │Backend │          │Database│
└──┬───┘          └───┬────┘          └───┬────┘          └───┬────┘
   │    Enter Email   │                   │                   │
   │ ─────────────>   │                   │                   │
   │                  │   Request Link    │                   │
   │                  │ ─────────────────>│                   │
   │                  │                   │    Store Token    │
   │                  │                   │ ────────────────> │
   │                  │                   │                   │
   │                  │   Send Response   │                   │
   │                  │ <─────────────────│                   │
   │                  │                   │                   │
   │   Email with Link│                   │                   │
   │ <────────────────│                   │                   │
   │                  │                   │                   │
   │ Click Magic Link │                   │                   │
   │ ─────────────>   │                   │                   │
   │                  │  Validate Token   │                   │
   │                  │ ─────────────────>│                   │
   │                  │                   │  Check Token      │
   │                  │                   │ ────────────────> │
   │                  │                   │                   │
   │                  │                   │  Token Valid      │
   │                  │                   │ <─ ─ ─ ─ ─ ─ ─ ─ │
   │                  │                   │                   │
   │                  │                   │  Mark Used        │
   │                  │                   │ ────────────────> │
   │                  │  Return Session   │                   │
   │                  │ <─────────────────│                   │
   │                  │                   │                   │
   │ Submit Feedback  │                   │                   │
   │ ─────────────>   │                   │                   │
   │                  │  Submit Feedback  │                   │
   │                  │ ─────────────────>│                   │
   │                  │                   │  Store Feedback   │
   │                  │                   │ ────────────────> │
   │                  │                   │                   │
   │                  │  Confirm Success  │                   │
   │                  │ <─────────────────│                   │
   │   Show Success   │                   │                   │
   │ <────────────────│                   │                   │
   │                  │                   │                   │
```

**Notes:**

- The `submission_count` column tracks edits (maximum 1 per submission)
- Magic Link tokens provide a secure method for anonymous submissions 
- Magic Links improve user experience by reducing friction

## 6. UI/UX Design & Improvements

The user interface has been significantly enhanced to provide a more intuitive and responsive experience:

### 6.1 Feedback Form
- **Progressive disclosure** - Form fields appear as needed
- **Real-time validation** with clear error messages
- **Accessibility improvements** including ARIA attributes and keyboard navigation
- **Responsive design** adapting to all screen sizes from mobile to desktop

### 6.2 Feedback List
- **Interactive sorting** by date, rating, and name
- **Filtering capability** by rating range and submission date
- **Infinite scrolling** for better performance with large datasets
- **Card-based layout** with consistent spacing and typography
- **Enhanced readability** with proper contrast and font sizing

### 6.3 Magic Link Flow
- **Simplified authentication process** with clear instructions
- **Email template** with branded design and clear call-to-action
- **Streamlined validation** with automatic form submission after link click
- **Clear session status indicators** to show authentication state

### 6.4 Design System Improvements
- **Consistent color palette** aligned with brand guidelines
- **Typography hierarchy** for better content organization
- **Component reusability** for consistent user experience
- **Animations and transitions** for better user feedback
- **Dark mode support** for reduced eye strain

## 7. API Endpoints

The API has been updated to support the Magic Link authentication flow:

### 7.1 Magic Link Endpoints
- `POST /api/v1/magic-link/request-magic-link` - Request a magic link via email
- `POST /api/v1/magic-link/validate-magic-link` - Validate a magic link token
- `POST /api/v1/magic-link/feedback` - Submit feedback with magic link authentication
- `GET /api/v1/magic-link/status` - Check current magic link session status

### 7.2 Magic Link API Implementation
The Magic Link API provides a secure and user-friendly authentication flow with the following endpoints:

## 8. Future Goals & Enhancements

### 8.1 AI-driven Semantic Analysis
- Automatically summarize feedback content
- Generate insights per rating range
- Sentiment analysis for qualitative feedback assessment
- Trend identification across time periods

### 8.2 Enhanced Admin Dashboard
- Dashboard displays summary of feedbacks by rating ranges:
  - 1–2 stars
  - 2–3 stars
  - 3–4 stars
  - 4–5 stars
  - 5 stars
- Advanced search, filter, and export functionality
- Visualization tools for feedback trends
- User management interface

### 8.3 Scalability Improvements
- Multi-tenant support for enterprise deployments
- Separate analytics database for heavy reporting
- Caching layer for improved performance
- Horizontal scaling of API services

### 8.4 Integration Capabilities
- Webhooks for real-time feedback notifications
- Integration with third-party analytics platforms
- Export to business intelligence tools
- Mobile app companion for administrators

## 9. Implementation Details: Magic Link Authentication

### 9.1 Database Schema

```sql
CREATE TABLE magic_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL,
    secret_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    session_token VARCHAR(255),
    ip_address VARCHAR(45)
);

CREATE INDEX idx_magic_links_email ON magic_links(email);
CREATE INDEX idx_magic_links_token ON magic_links(secret_token);
```

### 9.2 API Endpoints

1. **Magic Link API Endpoints:**
   - `POST /api/v1/magic-link/request-magic-link` - Request a magic link via email
   - `POST /api/v1/magic-link/validate-magic-link` - Validate a magic link token
   - `POST /api/v1/magic-link/feedback` - Submit feedback with magic link authentication

2. **Request/Response Format:**
   - Magic link requests only require an email address
   - Validation returns a session token for authenticated API calls
   - Simple, secure flow with minimal user friction

### 9.3 Frontend Implementation

1. **Component Architecture:**
   - `MagicLinkHandler.tsx` component for processing incoming magic links
   - `MagicLinkPage.tsx` page for handling the magic link flow
   - `FeedbackForm.tsx` integrates with magic link authentication

2. **UX Flow:**
   - User enters email and requests magic link
   - User clicks link in received email
   - System automatically validates and authenticates
   - User submits feedback with session already established

### 9.4 Email Templates

1. **Email Design:**
   - Professional magic link email with clickable button
   - Clear instructions and security information
   - Branded design consistent with application
   - Mobile-friendly responsive layout

### 9.5 Security Considerations

1. **Token Security:**
   - Magic link tokens use cryptographically secure random strings
   - One-time use enforcement prevents replay attacks
   - IP address logging for audit purposes
   - 24-hour expiration times enforced in database and application logic

2. **Best Practices:**
   - Rate limiting on magic link requests
   - Monitoring for unusual patterns in magic link usage
   - Device fingerprinting for enhanced security
   - Clear user feedback throughout the authentication process