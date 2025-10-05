from fastapi import APIRouter
from app.api.v1.feedback_routes import feedback_captcha

api_router = APIRouter()
api_router.include_router(feedback_captcha.router)
