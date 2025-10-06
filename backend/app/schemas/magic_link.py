from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class MagicLinkRequest(BaseModel):
    """Schema for requesting a magic link."""
    email: EmailStr


class MagicLinkCreate(BaseModel):
    """Schema for creating a magic link in the database."""
    email: EmailStr
    secret_token: str


class MagicLinkDB(BaseModel):
    """Schema for magic link data from database."""
    id: UUID
    email: EmailStr
    secret_token: str
    created_at: datetime
    expires_at: datetime
    used: bool

    class Config:
        orm_mode = True


class MagicLinkValidation(BaseModel):
    """Schema for validating a magic link."""
    email: EmailStr
    token: str


class FeedbackWithMagicLink(BaseModel):
    """Schema for submitting feedback with a magic link token."""
    first_name: str
    last_name: str
    email: EmailStr
    mobile: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    feedback: str
    magic_token: str