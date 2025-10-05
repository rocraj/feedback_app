from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.crud import feedback as crud_feedback
from app.services.captcha_service import verify_captcha

router = APIRouter(prefix="/feedback", tags=["Feedback (Captcha)"])

@router.post("/", response_model=FeedbackResponse)
async def submit_feedback(feedback_in: FeedbackCreate, db: Session = Depends(get_db)):
    # Verify captcha
    if not await verify_captcha(feedback_in.captcha_token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Captcha")

    existing = crud_feedback.get_by_email(db, feedback_in.email)
    if existing:
        updated = crud_feedback.update_feedback(db, existing, feedback_in)
        if not updated:
            raise HTTPException(status_code=403, detail="Feedback already edited once")
        return updated

    return crud_feedback.create_feedback(db, feedback_in)
