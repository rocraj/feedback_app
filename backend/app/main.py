from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the FastAPI application
app = FastAPI(
    title="Feedback App Backend - Health Check",
    version="0.1.0",
    description="Minimal backend for health check"
)

# Optional CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """
    Simple health/status endpoint to confirm backend is running.
    """
    return {"message": "Backend is running!"}
