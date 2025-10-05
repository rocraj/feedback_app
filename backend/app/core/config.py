import os
from pydantic_settings import BaseSettings
from typing import Optional

# --- Mocking Environment Variables for Colab/Standalone Execution ---
# In a real application, these would be loaded from your .env file.
os.environ["POSTGRES_USER"] = "test_user_colab"
os.environ["POSTGRES_PASSWORD"] = "secret_password"
os.environ["POSTGRES_DB"] = "feedback_db"
os.environ["POSTGRES_HOST"] = "localhost" # Changed from 'feedback-db' for local testing
# os.environ["POSTGRES_PORT"] = "5432" # 5432 is the default, no need to set if default is used

class Settings(BaseSettings):
    """
    Application-wide settings managed by Pydantic Settings.
    This class loads its fields directly from the environment variables.
    """
    # Core API settings
    PROJECT_NAME: str = "Simple Feedback App Backend"
    API_V1_STR: str = "/api/v1"

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
        # Example format: postgresql+psycopg://user:password@host:port/dbname
        return f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
# Initialize settings to be imported by other modules
settings = Settings()

# --- Example Usage ---
print("--- Settings Loaded Successfully ---")
print(f"Project Name: {settings.PROJECT_NAME}")
print(f"Database User (POSTGRES_USER): {settings.POSTGRES_USER}")
print(f"Database URL (Calculated Property): {settings.DATABASE_URL}")
