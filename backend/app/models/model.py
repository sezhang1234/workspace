from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Model(Base):
    __tablename__ = "models"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    provider = Column(String(100), nullable=False)  # e.g., 'openai', 'anthropic', 'local'
    model_type = Column(String(100), nullable=False)  # e.g., 'gpt-4', 'claude-3', 'llama'
    api_key = Column(Text)  # Encrypted API key
    base_url = Column(String(500))  # For custom endpoints
    config = Column(JSON)  # Model-specific configuration
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", backref="models")
    
    def __repr__(self):
        return f"<Model(id={self.id}, name='{self.name}', provider='{self.provider}')>"