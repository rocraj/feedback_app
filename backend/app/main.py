import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging

# --- Load environment variables at the very beginning ---
# Get the backend directory path (one level up from the app directory)
backend_dir = Path(__file__).resolve().parent.parent
dotenv_path = backend_dir / '.env'

# Load the .env file from the backend directory
if dotenv_path.exists():
    load_dotenv(dotenv_path=dotenv_path)
    print(f"Loading environment from: {dotenv_path}")
else:
    print(f"Warning: .env file not found at {dotenv_path}. Using default environment variables.")

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.init_db import init_db

# --- Setup logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# --- Log environment configuration ---
logger.info("Environment Configuration:")
logger.info(f"FRONTEND_URL: {os.getenv('FRONTEND_URL', 'Not set')}")
logger.info(f"DATABASE_URL set: {'Yes' if os.getenv('DATABASE_URL') else 'No'}")
logger.info(f"DB_USER set: {'Yes' if os.getenv('DB_USER') else 'No'}")
logger.info(f"DB_HOST set: {'Yes' if os.getenv('DB_HOST') else 'No'}")
logger.info(f"SMTP settings configured: {'Yes' if os.getenv('SMTP_USER') else 'No'}")

# --- Initialize FastAPI app with detailed metadata ---
app = FastAPI(
    title="Feedback App Backend",
    version="1.1.0",
    description=(
        "Backend API for the **Feedback Management System** — "
        "supports simple feedback submission (one per email) "
        "and Magic Link authentication for secure feedback submission.\n\n"
        "**Swagger UI:** `/docs`\n"
        "**ReDoc:** `/redoc`\n"
        "**OpenAPI Spec:** `/openapi.json`"
    ),
    contact={
        "name": "Mahesh Raju",
        "email": "srimaheshraju@gmail.com",
        "url": "https://github.com/rocraj/feedback_app",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# --- Enable CORS (recommended to restrict in production) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include API router ---
app.include_router(api_router, prefix=settings.API_V1_STR)

# --- Health check endpoint ---
@app.get("/", tags=["Health"])
async def root():
    """
    Health check endpoint — confirms backend is up and running.
    """
    return {
        "status": "ok",
        "message": "Feedback App Backend running successfully",
        "version": "1.1.0"
    }

@app.get("/health/db", tags=["Health"])
async def db_health():
    """
    Database health check endpoint - tests database connectivity
    """
    from sqlalchemy import text
    from app.db.session import engine
    import os
    
    try:
        # Try a simple database query
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            conn.commit()
            
        return {
            "status": "ok",
            "message": "Database connection successful",
            "env": "Google Cloud" if os.getenv("GAE_APPLICATION") else "Local"
        }
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}",
            "env": "Google Cloud" if os.getenv("GAE_APPLICATION") else "Local"
        }

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        # Log database connection details (with sensitive info masked)
        from app.core.config import settings
        db_url = settings.DATABASE_URL
        if ":" in db_url and "@" in db_url:
            parts = db_url.split("@")
            masked_credentials = parts[0].split("://")[0] + "://" + parts[0].split("://")[1].split(":")[0] + ":****"
            masked_url = masked_credentials + "@" + parts[1]
            logger.info(f"Connecting to database: {masked_url}")
        else:
            logger.info(f"Database URL format: {db_url.split('://')[0] if '://' in db_url else 'unknown'}")
        
        # Initialize database
        logger.info("Initializing database")
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        # Log additional information to help diagnose the issue
        is_gcp = os.getenv("GAE_APPLICATION") is not None
        logger.info(f"Running in Google Cloud environment: {is_gcp}")
        if is_gcp:
            instance_connection_name = os.getenv("INSTANCE_CONNECTION_NAME", "feedback-backend-app:us-central1:feedback-db")
            logger.info(f"Cloud SQL instance connection name: {instance_connection_name}")
        
        # Environment information for debugging
        logger.info(f"DB_HOST: {os.getenv('DB_HOST', 'Not set')}")
        logger.info(f"DB_USER: {os.getenv('DB_USER', 'Not set')}")
        logger.info(f"DB_NAME: {os.getenv('DB_NAME', 'Not set')}")
        
        logger.warning("Continuing without database initialization - this may cause issues with API endpoints that require database access")
