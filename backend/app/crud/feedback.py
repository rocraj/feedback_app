from typing import List, Optional, Union
from uuid import UUID
from sqlalchemy.orm import Session
from app.db.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackUpdate, FeedbackCaptcha, FeedbackMagicLink

def get_by_email(db: Session, email: str) -> Optional[Feedback]:
    """Get a feedback by email address."""
    return db.query(Feedback).filter(Feedback.email == email).first()

def get_by_id(db: Session, feedback_id: UUID) -> Optional[Feedback]:
    """Get a feedback by ID."""
    return db.query(Feedback).filter(Feedback.id == feedback_id).first()

def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Feedback]:
    """Get all feedbacks with pagination."""
    return db.query(Feedback).offset(skip).limit(limit).all()

def get_all_sorted(
    db: Session, 
    skip: int = 0, 
    limit: int = 5,
    sort_by: str = "created_at",
    sort_direction: str = "desc"
) -> List[Feedback]:
    """Get all feedbacks with pagination and sorting."""
    # Get the model class attributes
    model_attrs = Feedback.__table__.columns.keys()
    
    # Validate sort_by field
    if sort_by not in model_attrs:
        sort_by = "created_at"  # Default to created_at if invalid field
    
    # Get the column to sort by
    sort_column = getattr(Feedback, sort_by)
    
    # Apply sort direction
    if sort_direction.lower() == "asc":
        query = db.query(Feedback).order_by(sort_column.asc())
    else:
        query = db.query(Feedback).order_by(sort_column.desc())
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def get_count(db: Session) -> int:
    """Get the total count of feedback entries."""
    return db.query(Feedback).count()

def create_feedback(db: Session, feedback_in: Union[FeedbackCreate, FeedbackCaptcha, FeedbackMagicLink], 
                    user_id: Optional[UUID] = None, 
                    magic_link_id: Optional[UUID] = None) -> Feedback:
    """Create a new feedback entry."""
    # Extract the base feedback data (excluding captcha_token or magic_token)
    feedback_data = feedback_in.dict()
    
    # Remove non-model fields if they exist
    if hasattr(feedback_in, "captcha_token"):
        captcha_token = feedback_data.pop("captcha_token", None)
    else:
        captcha_token = None
        
    if hasattr(feedback_in, "magic_token"):
        feedback_data.pop("magic_token", None)
    
    # Create the feedback object
    feedback = Feedback(
        **feedback_data,
        user_id=user_id,
        magic_link_id=magic_link_id,
        captcha_token=captcha_token
    )
    
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

def update_feedback(db: Session, db_feedback: Feedback, 
                    feedback_update: FeedbackUpdate) -> Optional[Feedback]:
    """Update an existing feedback if submission_count is 1."""
    if db_feedback.submission_count > 1:
        return None
    
    update_data = feedback_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if value is not None:
            setattr(db_feedback, field, value)
    
    db_feedback.submission_count += 1
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def get_feedback_count_by_rating_range(db: Session) -> dict:
    """Get count of feedback grouped by rating ranges."""
    # Query for each rating range
    rating_1_2 = db.query(Feedback).filter(Feedback.rating >= 1, Feedback.rating < 2).count()
    rating_2_3 = db.query(Feedback).filter(Feedback.rating >= 2, Feedback.rating < 3).count()
    rating_3_4 = db.query(Feedback).filter(Feedback.rating >= 3, Feedback.rating < 4).count()
    rating_4_5 = db.query(Feedback).filter(Feedback.rating >= 4, Feedback.rating < 5).count()
    rating_5 = db.query(Feedback).filter(Feedback.rating == 5).count()
    
    return {
        "1-2": rating_1_2,
        "2-3": rating_2_3,
        "3-4": rating_3_4,
        "4-5": rating_4_5,
        "5": rating_5
    }
