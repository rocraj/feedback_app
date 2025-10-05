from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from app.db.base import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    mobile = Column(String(15), nullable=True)
    rating = Column(Float, nullable=False)
    feedback = Column(Text, nullable=False)
    editable = Column(Boolean, default=True)
