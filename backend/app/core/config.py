from typing import List
from pydantic import BaseSettings, validator
import os


class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/jiuwen_db"
    DATABASE_TEST_URL: str = "postgresql://user:password@localhost:5432/jiuwen_test_db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-make-it-long-and-random"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379"
    
    # Application Settings
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Jiuwen Agent Studio"
    VERSION: str = "1.0.0"
    
    # External Services (optional)
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()