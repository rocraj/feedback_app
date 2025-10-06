from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timedelta

from app.db.base import Base


class MagicLink(Base):
    """
    Model for storing magic link tokens for email verification and feedback submission.
    """
    __tablename__ = "magic_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, index=True, nullable=False)
    secret_token = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(hours=24))
    used = Column(Boolean, default=False)
    
    def is_valid(self) -> bool:
        """Check if the magic link is still valid (not expired and not used)."""
        return not self.used and datetime.utcnow() < self.expires_at