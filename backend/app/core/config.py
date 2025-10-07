import os
from pydantic_settings import BaseSettings
from typing import Optional, List

# --- Mocking Environment Variables for Colab/Standalone Execution ---
# In a real application, these would be loaded from your .env file.
os.environ["POSTGRES_USER"] = "postgres"
os.environ["POSTGRES_PASSWORD"] = "password"
os.environ["POSTGRES_DB"] = "feedback_db"
os.environ["POSTGRES_HOST"] = "localhost" # Changed from 'feedback-db' for local testing
# os.environ["POSTGRES_PORT"] = "5432" # 5432 is the default, no need to set if default is used
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
    
    # CORS
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,https://feedback-mini.web.app").split(",")
    
    # Frontend URL (for magic links)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # Email settings
    EMAIL_BACKEND: str = "SMTP"  # Options: SMTP, CONSOLE
    SMTP_HOST: Optional[str] = "smtp.gmail.com"
    SMTP_PORT: Optional[int] = 587
    SMTP_USER: Optional[str] = "srimaheshraju@gmail.com"
    SMTP_PASSWORD: Optional[str] = "xodv zmsr ukhc rajz"
    EMAILS_FROM_EMAIL: str = "feedback@example.com"
    
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
        # Use psycopg2 instead of psycopg as that's what's installed
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
# Initialize settings to be imported by other modules
settings = Settings()

# --- Example Usage ---
print("--- Settings Loaded Successfully ---")
print(f"Project Name: {settings.PROJECT_NAME}")
print(f"Database User (POSTGRES_USER): {settings.POSTGRES_USER}")
print(f"Database URL (Calculated Property): {settings.DATABASE_URL}")
