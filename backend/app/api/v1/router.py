from fastapi import APIRouter
from app.api.v1.feedback_routes import feedback_magic_link
from app.api.v1.feedback_routes import feedback_simple  # Renamed from feedback_captcha

api_router = APIRouter()

# Add a root endpoint to the API router for better debugging and navigation
@api_router.get("/", tags=["API Info"])
async def api_root():
    """
    API v1 root endpoint — shows available endpoints and API information.
    """
    return {
        "status": "ok",
        "message": "Feedback App API v1",
        "available_endpoints": [
            "/feedback",
            "/magic-link/request-magic-link",
            "/magic-link/validate-magic-link",
            "/magic-link/feedback"
        ]
    }

api_router.include_router(feedback_simple.router)  # Changed to use simple feedback router
api_router.include_router(feedback_magic_link.router, prefix="/magic-link", tags=["magic-link"])
