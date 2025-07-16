from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/citypulse"
    
    # Redis (optional)
    REDIS_URL: Optional[str] = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application
    APP_NAME: str = "CityPulse Analytics"
    PROJECT_NAME: str = "CityPulse Analytics"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    
    # External APIs (optional)
    OPENWEATHER_API_KEY: Optional[str] = ""
    GOOGLE_MAPS_API_KEY: Optional[str] = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # This allows extra fields in .env file

settings = Settings()
