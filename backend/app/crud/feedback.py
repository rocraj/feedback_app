from sqlalchemy.orm import Session
from app.db.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate

def get_by_email(db: Session, email: str):
    return db.query(Feedback).filter(Feedback.email == email).first()

def create_feedback(db: Session, feedback_in: FeedbackCreate):
    feedback = Feedback(
        first_name=feedback_in.first_name,
        last_name=feedback_in.last_name,
        email=feedback_in.email,
        mobile=feedback_in.mobile,
        rating=feedback_in.rating,
        feedback=feedback_in.feedback,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

def update_feedback(db: Session, existing, feedback_in: FeedbackCreate):
    if not existing.editable:
        return None
    for field, value in feedback_in.dict(exclude={"captcha_token"}).items():
        setattr(existing, field, value)
    existing.editable = False
    db.commit()
    db.refresh(existing)
    return existing
