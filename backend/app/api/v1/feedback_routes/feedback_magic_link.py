from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
import logging

from app.db.session import get_db
from app.services.magic_link_service import (
    create_magic_link,
    send_magic_link_email,
    validate_magic_link,
    mark_magic_link_as_used
)
from app.schemas.magic_link import MagicLinkRequest, MagicLinkValidation
from app.schemas.feedback import FeedbackCreate
from app.schemas.combined_schemas import FeedbackWithMagicToken
from app.crud import feedback as feedback_crud
from fastapi.exceptions import RequestValidationError
from fastapi import Body

router = APIRouter()


@router.post("/request-magic-link", response_model=Dict[str, Any])
async def request_magic_link(
    request: MagicLinkRequest,
    db: Session = Depends(get_db)
):
    """
    Request a magic link to be sent to the provided email.
    This link will allow the user to submit feedback.
    """
    # Create a magic link token
    token = create_magic_link(db, request.email)
    
    # Send the magic link via email
    email_sent = send_magic_link_email(request.email, token)
    
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send magic link email"
        )
    
    return {
        "status": "success",
        "message": "Magic link sent to your email"
    }


@router.post("/validate-magic-link", response_model=Dict[str, Any])
async def validate_magic_link_token(
    validation: MagicLinkValidation,
    db: Session = Depends(get_db)
):
    """
    Validate a magic link token.
    Used to verify if a token is valid before allowing feedback submission.
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
        "expires_at": magic_link.expires_at
    }


@router.post("/feedback", response_model=Dict[str, Any])
async def submit_feedback_with_magic_link(
    request_body: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Submit feedback using a valid magic link token.
    Accepts both the structured format (feedback_data + validation) and the flat format.
    """
    logger = logging.getLogger(__name__)
    logger.info(f"Received feedback submission with body: {request_body}")
    
    # Try to determine the format of the request
    if "feedback_data" in request_body and "validation" in request_body:
        # Structured format from the updated frontend
        try:
            feedback_data = FeedbackCreate(**request_body["feedback_data"])
            validation = MagicLinkValidation(**request_body["validation"])
            logger.info("Parsed structured request format")
        except Exception as e:
            logger.error(f"Error parsing structured request: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid structured request format: {str(e)}"
            )
    else:
        # Try the flat format from the original frontend
        try:
            combined_data = FeedbackWithMagicToken(**request_body)
            feedback_data = combined_data.to_feedback_create()
            validation = combined_data.to_magic_link_validation()
            logger.info("Parsed flat request format")
        except Exception as e:
            logger.error(f"Error parsing flat request: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid request format: {str(e)}"
            )
    
    # Validate the magic link
    magic_link = validate_magic_link(db, validation.email, validation.token)
    
    if not magic_link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired magic link"
        )
    
    # Make sure the email in the feedback matches the magic link email
    if feedback_data.email != magic_link.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email in feedback doesn't match the magic link email"
        )
    
    # Create the feedback
    db_feedback = feedback_crud.create_feedback(db, feedback_data)
    
    # Mark the magic link as used
    mark_magic_link_as_used(db, magic_link)
    
    return {
        "status": "success",
        "message": "Feedback submitted successfully",
        "feedback_id": str(db_feedback.id)
    }