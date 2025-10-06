from fastapi import APIRouter
from app.api.v1.feedback_routes import feedback_magic_link
from app.api.v1.feedback_routes import feedback_simple  # Renamed from feedback_captcha

api_router = APIRouter()
api_router.include_router(feedback_simple.router)  # Changed to use simple feedback router
api_router.include_router(feedback_magic_link.router, prefix="/magic-link", tags=["magic-link"])
