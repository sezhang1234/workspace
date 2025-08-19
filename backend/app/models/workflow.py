from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", backref="workflows")
    nodes = relationship("WorkflowNode", back_populates="workflow", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Workflow(id={self.id}, name='{self.name}', created_by={self.created_by})>"


class WorkflowNode(Base):
    __tablename__ = "workflow_nodes"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"), nullable=False)
    node_type = Column(String(100), nullable=False)  # e.g., 'llm', 'tool', 'condition', 'input', 'output'
    name = Column(String(255), nullable=False)
    position_x = Column(Integer, default=0)
    position_y = Column(Integer, default=0)
    config = Column(JSON)  # Node-specific configuration
    connections = Column(JSON)  # Store input/output connections
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    workflow = relationship("Workflow", back_populates="nodes")
    
    def __repr__(self):
        return f"<WorkflowNode(id={self.id}, name='{self.name}', type='{self.node_type}')>"