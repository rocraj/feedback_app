import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List
import json

class Settings(BaseSettings):
    """
    Application-wide settings managed by Pydantic Settings.
    This class loads its fields directly from the environment variables.
    """
    # Allow environment variable override
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    
    # Core API settings
    PROJECT_NAME: str = "Feedback App Backend"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str 
    
    # Frontend URL (for magic links)
    FRONTEND_URL: str
    
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
    
    # Email settings - use environment variables with defaults
    EMAIL_BACKEND: str = "SMTP"  # Options: SMTP, CONSOLE
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str
    EMAILS_FROM_EMAIL: str
    
    # Magic link settings
    MAGIC_LINK_EXPIRY_HOURS: int = 24
    
    # Database settings mapped directly from environment variables
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_HOST: str
    DB_PORT: int
    
    # For backwards compatibility
    @property
    def POSTGRES_USER(self) -> str:
        return self.DB_USER
        
    @property
    def POSTGRES_PASSWORD(self) -> str:
        return self.DB_PASSWORD
        
    @property
    def POSTGRES_DB(self) -> str:
        return self.DB_NAME
        
    @property
    def POSTGRES_HOST(self) -> str:
        return self.DB_HOST
        
    @property
    def POSTGRES_PORT(self) -> int:
        return self.DB_PORT
        
    # Generate the database connection URL for SQLAlchemy
    # Note: This is a property, meaning it's calculated every time it's accessed.
    @property
    def DATABASE_URL(self) -> str:
        # Use direct DATABASE_URL environment variable if set
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            # Convert postgres:// to postgresql+psycopg2:// for SQLAlchemy
            if db_url.startswith("postgres://"):
                db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
            return db_url
        
        # Check if running in Google Cloud environment
        is_gcp = os.getenv("GAE_APPLICATION") is not None
        
        if is_gcp:
            # Cloud SQL connection via Unix socket (for managed Cloud SQL)
            instance_connection_name = os.getenv("INSTANCE_CONNECTION_NAME", "")
            if instance_connection_name:
                # Format specifically for PostgreSQL with psycopg2 driver in App Engine
                socket_path = f"/cloudsql/{instance_connection_name}"
                return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@/{self.DB_NAME}?host={socket_path}"
            
            # For external PostgreSQL instance (like Aiven), use standard connection
            # App Engine can connect to external databases using standard connection strings
            return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        
        # Standard connection string for local or other environments
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
# Initialize settings to be imported by other modules
try:
    settings = Settings()
    
    # --- Log Configuration ---
    print("--- Settings Loaded Successfully ---")
    print(f"Project Name: {settings.PROJECT_NAME}")
    print(f"Frontend URL: {settings.FRONTEND_URL}")
    
    # Mask sensitive parts of the database URL for security
    db_url = settings.DATABASE_URL
    if ":" in db_url and "@" in db_url:
        parts = db_url.split("@")
        masked_credentials = parts[0].split("://")[0] + "://" + parts[0].split("://")[1].split(":")[0] + ":****"
        masked_url = masked_credentials + "@" + parts[1]
        print(f"Database URL: {masked_url}")
    else:
        print(f"Database URL: {db_url.split('://')[0]}://*****")
    
    print(f"DB Host: {settings.DB_HOST}")
    print(f"Email Configuration: SMTP via {settings.SMTP_HOST}")
except Exception as e:
    print(f"Error loading settings: {e}")
    print("Please check your .env file and ensure all required variables are set")
    raise
