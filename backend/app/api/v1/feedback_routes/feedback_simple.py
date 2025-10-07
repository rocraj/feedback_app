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

@router.get("/")
async def get_all_feedback(
    page: int = 1,
    size: int = 5,
    sort_by: str = "created_at",
    sort_direction: str = "desc",
    db: Session = Depends(get_db)
):
    # Calculate the offset based on page and size
    skip = (page - 1) * size
    
    # Get feedbacks with pagination and sorting
    feedbacks = crud_feedback.get_all_sorted(
        db, 
        skip=skip, 
        limit=size, 
        sort_by=sort_by, 
        sort_direction=sort_direction
    )
    
    # Get total count for pagination
    total_count = crud_feedback.get_count(db)
    
    # Calculate total pages
    total_pages = (total_count + size - 1) // size if size > 0 else 1
    
    # Return paginated response
    return {
        "items": feedbacks,
        "total": total_count,
        "page": page,
        "size": size,
        "pages": total_pages
    }