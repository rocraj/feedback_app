import logging
from sqlalchemy.exc import SQLAlchemyError
from app.db.base import Base
from app.db.session import engine

# Import all the models so they can be detected by SQLAlchemy
# This is needed for SQLAlchemy to create tables
from app.db.models.magic_link import MagicLink
from app.db.models.feedback import Feedback
from app.db.models.user import User

logger = logging.getLogger(__name__)

def init_db() -> None:
    """
    Initialize the database.
    Creates all tables defined in the models.
    """
    try:
        logger.info("Creating database tables...")
        # Create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except SQLAlchemyError as e:
        logger.error(f"Error initializing database: {e}")
        raise
