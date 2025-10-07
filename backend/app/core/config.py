import os
from pydantic_settings import BaseSettings
from typing import Optional, List
import json

# These values are kept for reference but not used since we always connect to Aiven cloud
# In development environment, set defaults (unused now)

os.environ["POSTGRES_USER"] = "postgres"
os.environ["POSTGRES_PASSWORD"] = "password"
os.environ["POSTGRES_DB"] = "feedback_db"
os.environ["POSTGRES_HOST"] = "localhost" # Changed from 'feedback-db' for local testing
os.environ["POSTGRES_PORT"] = "5432" # 5432 is the default, no need to set if default is used
os.environ["FRONTEND_URL"] = "http://localhost:5173"
os.environ["EMAIL_BACKEND"] = "SMTP"  # Options: SMTP, CONSOLE


class Settings(BaseSettings):
    """
    Application-wide settings managed by Pydantic Settings.
    This class loads its fields directly from the environment variables.
    """
    # Core API settings
    PROJECT_NAME: str = "Feedback App Backend"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey123")
    
    # CORS - Handle as a property instead of a field to avoid JSON parsing issues
    @property
    def CORS_ORIGINS(self) -> List[str]:
        cors_env = os.getenv("CORS_ORIGINS", "")
        if cors_env:
            try:
                # Try to parse as JSON first
                return json.loads(cors_env)
            except json.JSONDecodeError:
                # Fallback to comma-separated string
                return cors_env.split(",")
        return ["http://localhost:5173", "http://localhost:3000", 
                "http://127.0.0.1:5173", "http://127.0.0.1:3000", 
                "https://feedback-mini.web.app"]
    
    # Frontend URL (for magic links)
    FRONTEND_URL: str = "https://feedback-mini.web.app"
    
    # Email settings
    EMAIL_BACKEND: str = "SMTP"  # Options: SMTP, CONSOLE (hardcoded)
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: Optional[int] = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER", "example@gmail.com")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD", "")  # Set via environment variable only
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "feedback@example.com")
    
    # Magic link settings
    MAGIC_LINK_EXPIRY_HOURS: int = 24
    
    # Database settings (These will be pulled from the environment)
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str = "feedback-db" 
    POSTGRES_PORT: int = 5432
    
    # Generate the database connection URL for SQLModel
    # Note: This is a property, meaning it's calculated every time it's accessed.
    @property
    def DATABASE_URL(self) -> str:
        # Use environment variable if set, otherwise construct from component parts
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            # Convert postgres:// to postgresql+psycopg2:// for SQLAlchemy
            if db_url.startswith("postgres://"):
                db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
            return db_url
        
        # Fallback to using component parts (should be set via environment variables)
        db_user = os.getenv("DB_USER", "postgres")
        db_password = os.getenv("DB_PASSWORD", "password")  # Should be overridden in production
        db_host = os.getenv("DB_HOST", "localhost")
        db_port = os.getenv("DB_PORT", "5432")
        db_name = os.getenv("DB_NAME", "feedback_db")
        
        return f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    
# Initialize settings to be imported by other modules
settings = Settings()

# --- Example Usage ---
print("--- Settings Loaded Successfully ---")
print(f"Project Name: {settings.PROJECT_NAME}")
print(f"CORS Origins: {settings.CORS_ORIGINS}")
print(f"Database URL: {settings.DATABASE_URL}")
