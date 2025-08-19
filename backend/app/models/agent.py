from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    system_prompt = Column(Text, nullable=False)
    model_config = Column(JSON)  # Store model configuration (provider, model name, etc.)
    tools_config = Column(JSON)  # Store tools configuration
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", backref="agents")
    
    def __repr__(self):
        return f"<Agent(id={self.id}, name='{self.name}', created_by={self.created_by})>"