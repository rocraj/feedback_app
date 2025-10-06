import secrets
import string
import logging
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session
from app.db.models.magic_link import MagicLink
from app.utils.email_utils import send_email
from app.core.config import settings

logger = logging.getLogger(__name__)


def generate_secure_token(length: int = 64) -> str:
    """Generate a secure random token."""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def create_magic_link(db: Session, email: str) -> str:
    """
    Create a magic link for the given email.
    Returns the generated secure token.
    """
    token = generate_secure_token()
    
    # Check if there's an existing unused token for this email
    existing_token = db.query(MagicLink).filter(
        MagicLink.email == email,
        MagicLink.used == False,
        MagicLink.expires_at > datetime.utcnow()
    ).first()
    
    # If found, invalidate the old token
    if existing_token:
        existing_token.used = True
        db.commit()
    
    # Create a new magic link
    magic_link = MagicLink(
        email=email,
        secret_token=token,
        expires_at=datetime.utcnow() + timedelta(hours=24)
    )
    
    db.add(magic_link)
    db.commit()
    db.refresh(magic_link)
    
    return token


def send_magic_link_email(email: str, token: str) -> bool:
    """Send an email with the magic link."""
    frontend_url = settings.FRONTEND_URL
    magic_link = f"{frontend_url}/feedback?email={email}&token={token}"
    
    logger.info(f"Generating magic link email for {email}")
    logger.info(f"Magic link URL: {magic_link}")
    
    subject = "Your Feedback Link"
    content = f"""
    <p>Hello,</p>
    <p>Thank you for your interest in providing feedback. Please click the link below to submit your feedback:</p>
    <p><a href="{magic_link}">Submit Feedback</a></p>
    <p>This link will expire in 24 hours.</p>
    <p>If you did not request this link, please ignore this email.</p>
    """
    
    logger.info(f"Sending magic link email to {email} using {settings.EMAIL_BACKEND} backend")
    result = send_email(to_email=email, subject=subject, html_content=content)
    logger.info(f"Email send result: {'Success' if result else 'Failed'}")
    return result


def validate_magic_link(db: Session, email: str, token: str) -> Optional[MagicLink]:
    """
    Validate a magic link token for the given email.
    Returns the MagicLink object if valid, None otherwise.
    """
    magic_link = db.query(MagicLink).filter(
        MagicLink.email == email,
        MagicLink.secret_token == token,
        MagicLink.used == False,
        MagicLink.expires_at > datetime.utcnow()
    ).first()
    
    return magic_link


def mark_magic_link_as_used(db: Session, magic_link: MagicLink) -> None:
    """Mark a magic link as used after successful feedback submission."""
    magic_link.used = True
    db.commit()