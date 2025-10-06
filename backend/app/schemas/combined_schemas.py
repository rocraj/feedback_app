from typing import Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field
from app.schemas.feedback import FeedbackCreate
from app.schemas.magic_link import MagicLinkValidation

# This model combines the feedback data and magic link token in a single request
# It's used to support the current frontend implementation
class FeedbackWithMagicToken(BaseModel):
    # Feedback data fields
    first_name: str
    last_name: str
    email: EmailStr
    mobile: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    feedback: str
    
    # Magic link token
    magic_token: str
    
    # Convert to the separate models expected by the API
    def to_feedback_create(self) -> FeedbackCreate:
        """Convert to FeedbackCreate model"""
        return FeedbackCreate(
            first_name=self.first_name,
            last_name=self.last_name,
            email=self.email,
            mobile=self.mobile,
            rating=self.rating,
            feedback=self.feedback
        )
    
    def to_magic_link_validation(self) -> MagicLinkValidation:
        """Convert to MagicLinkValidation model"""
        return MagicLinkValidation(
            email=self.email,
            token=self.magic_token
        )