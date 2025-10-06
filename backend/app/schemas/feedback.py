from pydantic import BaseModel, EmailStr, Field, UUID4
from typing import Optional
from datetime import datetime

class FeedbackBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    mobile: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    feedback: str

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackCaptcha(FeedbackBase):
    captcha_token: str  # from frontend CAPTCHA verification

class FeedbackMagicLink(FeedbackBase):
    magic_token: str  # from magic link

class FeedbackUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    feedback: Optional[str] = None

class FeedbackInDB(FeedbackBase):
    id: UUID4
    user_id: Optional[UUID4] = None
    captcha_token: Optional[str] = None
    magic_link_id: Optional[UUID4] = None
    submission_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class FeedbackResponse(FeedbackBase):
    id: UUID4
    submission_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
