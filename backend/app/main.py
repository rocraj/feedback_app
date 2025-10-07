from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.init_db import init_db

# --- Setup logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# --- Load environment variables early ---
load_dotenv()

# --- Initialize FastAPI app with detailed metadata ---
app = FastAPI(
    title="Feedback App Backend",
    version="1.0.0",
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
        "email": "maheshraju@example.com",  # Replace with your contact
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
        "version": "1.0.0"
    }

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    logger.info("Initializing database")
    init_db()
    logger.info("Database initialized successfully")
