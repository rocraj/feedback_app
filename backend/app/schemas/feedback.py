from pydantic import BaseModel, EmailStr, Field

class FeedbackBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    mobile: str | None = None
    rating: float = Field(..., ge=1, le=5)
    feedback: str

class FeedbackCreate(FeedbackBase):
    captcha_token: str  # from frontend

class FeedbackResponse(FeedbackBase):
    id: int
    editable: bool

    class Config:
        orm_mode = True
