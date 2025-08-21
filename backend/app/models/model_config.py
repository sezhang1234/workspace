from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class ModelConfig(Base):
    __tablename__ = "model_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    provider = Column(String, nullable=False)  # openai, anthropic, deepseek, qwen, etc.
    model_type = Column(String, nullable=False)  # gpt-4, claude-3, etc.
    api_key = Column(String, nullable=True)  # encrypted in production
    base_url = Column(String, nullable=True)  # for custom endpoints
    is_active = Column(Boolean, default=True)
    config = Column(JSON, default=dict)  # Additional configuration
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<ModelConfig(id={self.id}, name='{self.name}', provider='{self.provider}')>"