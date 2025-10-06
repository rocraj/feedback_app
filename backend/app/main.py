from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- Load environment variables early ---
load_dotenv()

# --- Initialize FastAPI app with detailed metadata ---
app = FastAPI(
    title="Feedback App Backend",
    version="1.0.0",
    description=(
        "Backend API for the **Feedback Management System** — "
        "supports user feedback submission, CAPTCHA verification. "
        "and OTP-based authentication for anonymous users.\n\n"
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
    allow_origins=["*"],  # TODO: Replace with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
