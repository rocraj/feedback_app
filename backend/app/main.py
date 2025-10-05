from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables early
load_dotenv()

# Import versioned router (Captcha version for now)
from app.api.v1.router import api_router

# Initialize the FastAPI application
app = FastAPI(
    title="Feedback App Backend - Captcha Version",
    version="0.1.0",
    description="API backend for the feedback application (Version 3: Anonymous + Captcha)"
)

# Optional CORS setup (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include versioned routes
app.include_router(api_router)

@app.get("/", tags=["Health"])
async def root():
    """
    Simple health/status endpoint to confirm backend is running.
    """
    return {"message": "Feedback App Backend running (Captcha Version)"}
