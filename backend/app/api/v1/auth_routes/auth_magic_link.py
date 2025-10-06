from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.db.session import get_db
from app.services.magic_link_service import (
    create_magic_link,
    send_magic_link_email,
    validate_magic_link
)
from app.schemas.magic_link import MagicLinkRequest, MagicLinkValidation

router = APIRouter()


@router.post("/send", response_model=Dict[str, Any])
async def send_magic_link(
    request: MagicLinkRequest,
    db: Session = Depends(get_db)
):
    """
    Send a magic link to the provided email address.
    This can be used for authentication or feedback submission.
    """
    token = create_magic_link(db, request.email)
    email_sent = send_magic_link_email(request.email, token)
    
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send magic link email"
        )
    
    return {
        "status": "success",
        "message": f"Magic link sent to {request.email}"
    }


@router.post("/verify", response_model=Dict[str, Any])
async def verify_magic_link(
    validation: MagicLinkValidation,
    db: Session = Depends(get_db)
):
    """
    Verify a magic link token.
    Returns validation status without marking the link as used.
    """
    magic_link = validate_magic_link(db, validation.email, validation.token)
    
    if not magic_link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired magic link"
        )
    
    return {
        "status": "success",
        "message": "Magic link is valid",
        "email": magic_link.email
    }