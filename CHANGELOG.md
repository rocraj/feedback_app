# Feedback App Changelog

## 🏁 Sprint 3 — Version 1.1.0 (Cloud Deployment)

Release Date: 2025-10-08
Status: ✅ Completed

### 🚀 Cloud Deployment
- Deployed backend to Google Cloud App Engine with automated scaling
- Deployed frontend to Firebase Hosting at https://feedback-mini.web.app
- Integrated with Aiven Cloud PostgreSQL for reliable database service
- Set up proper environment configuration for production use
- Created deployment scripts for automated deployment process

### 🔄 API & Backend
- Implemented backend pagination for feedback listings
- Added sorting functionality with multiple field options
- Enhanced error handling and validation
- Created API root endpoint for better navigation
- Simplified API authentication using per-email validation

### 📊 Frontend Improvements
- Connected frontend to cloud-hosted backend API
- Implemented robust pagination controls
- Added items-per-page selector
- Enhanced form validation and feedback
- Improved mobile responsiveness

### 🔧 DevOps & Tooling
- Created comprehensive deployment scripts (`deploy-backend.sh`, `deploy-frontend.sh`, `deploy-all.sh`)
- Enhanced local development setup with `start-all.sh`
- Improved security by removing sensitive information from codebase
- Added extensive documentation for deployment and API usage

## 🏁 Sprint 2 — Version 1.0.0 (Magic Link Authentication)

Release Date: 2025-10-07
Status: ✅ Completed

### 🔐 Authentication & Security
- Implemented secure Magic Link authentication system
- Added secure token generation with 24-hour expiration
- Created email delivery system for magic link distribution
- Implemented one-time use validation for security

### 🧩 API Extensions
- Added `/api/v1/magic-link/request-magic-link` endpoint
- Added `/api/v1/magic-link/validate-magic-link` endpoint
- Added `/api/v1/magic-link/feedback` endpoint for authenticated submissions

### 📱 UI/UX Improvements
- Enhanced feedback list with sorting and filtering capabilities
- Added responsive design improvements for mobile devices
- Implemented optimistic UI updates for smoother experience

### 📋 Database
- Added Magic Links table for secure token storage
- Implemented proper token expiration and cleanup

## 🏁 Sprint 1 — Version 0.9.0 (Initial Boilerplate Release)

Release Date: 2025-10-06
Status: ✅ Completed

### 🔧 Backend (FastAPI + Uvicorn)
- Set up FastAPI project structure with modular app layout
- Added .env support using python-dotenv
- Integrated CORS middleware for frontend communication
- Enabled Swagger UI (/docs) and ReDoc (/redoc)
- Added root health check endpoint (/)
- Defined metadata (title, version, license, contact) for API docs

### 💻 Frontend (React + Vite + TypeScript)
- Initialized React project with Vite 7 and TypeScript
- Added custom SCSS support (dark credential-style theme)
- Configured basic scripts for development and build

### 🧰 Bin Scripts
- Added start-backend.sh and start-frontend.sh for local execution
- Simplified project startup and testing process

### 🧱 Infrastructure
- Prepared Docker/Podman structure for future containerization
- Organized folders for scalability (backend/, frontend/, bin/)

## 🚀 Future Enhancements (Planned)
- Enhanced analytics dashboard with data visualization
- User management system with role-based access
- Integration with external feedback analysis tools
- Mobile application development
- Multi-language support