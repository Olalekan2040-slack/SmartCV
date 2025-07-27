from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Database
    DATABASE_URL: Optional[str] = None
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://smartcv-tau.vercel.app",
        "https://*.vercel.app"  # Allow all Vercel subdomains
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Add CORS origins from environment variable if set
        cors_origins = os.getenv("CORS_ORIGINS")
        if cors_origins:
            additional_origins = [origin.strip() for origin in cors_origins.split(",")]
            self.ALLOWED_HOSTS.extend(additional_origins)
    
    # Redis (optional)
    REDIS_URL: Optional[str] = None
    
    # Celery (optional)
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    
    # Stripe (optional)
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # Email (optional)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # AI Configuration (optional)
    GEMINI_API_KEY: Optional[str] = None
    
    # File upload
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    UPLOAD_DIR: str = "/tmp/uploads/"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()

# Validate required settings
if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")
