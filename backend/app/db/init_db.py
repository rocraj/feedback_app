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
        # First, test connection with a simple query
        import os
        from sqlalchemy import text
        
        logger.info("Testing database connection...")
        is_gcp = os.getenv("GAE_APPLICATION") is not None
        logger.info(f"Running in Google Cloud environment: {is_gcp}")
        
        try:
            with engine.connect() as conn:
                result = conn.execute(text("SELECT 1"))
                conn.commit()
            logger.info("Database connection successful")
        except Exception as conn_error:
            logger.error(f"Database connection test failed: {conn_error}")
            if is_gcp:
                # In Google Cloud, log additional connection information
                instance_conn_name = os.getenv("INSTANCE_CONNECTION_NAME", "")
                db_user = os.getenv("DB_USER", "")
                db_name = os.getenv("DB_NAME", "")
                logger.info(f"Cloud SQL connection details - Instance: {instance_conn_name}, User: {db_user}, DB: {db_name}")
            raise
        
        logger.info("Creating database tables...")
        # Create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except SQLAlchemyError as e:
        logger.error(f"Error initializing database: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error initializing database: {e}")
        raise
