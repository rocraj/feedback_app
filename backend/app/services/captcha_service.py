import httpx
from app.core.config import settings

async def verify_captcha(token: str) -> bool:
    data = {
        "secret": settings.CAPTCHA_SECRET_KEY,
        "response": token
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("https://www.google.com/recaptcha/api/siteverify", data=data)
        result = response.json()
        return result.get("success", False)
