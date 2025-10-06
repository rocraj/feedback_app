from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.crud import feedback as crud_feedback

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/", response_model=FeedbackResponse)
async def submit_feedback(feedback_in: FeedbackCreate, db: Session = Depends(get_db)):
    # No captcha verification needed
    existing = crud_feedback.get_by_email(db, feedback_in.email)
    if existing:
        updated = crud_feedback.update_feedback(db, existing, feedback_in)
        if not updated:
            raise HTTPException(status_code=403, detail="Feedback already edited once")
        return updated

    return crud_feedback.create_feedback(db, feedback_in)

@router.get("/", response_model=list[FeedbackResponse])
async def get_all_feedback(db: Session = Depends(get_db)):
    return crud_feedback.get_all(db)