from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

class WorkflowBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    trigger: str = Field(default="manual")
    tags: List[str] = Field(default_factory=list)

class WorkflowCreate(WorkflowBase):
    workflow_data: Optional[Dict[str, Any]] = None

class WorkflowUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = None
    trigger: Optional[str] = None
    tags: Optional[List[str]] = None
    workflow_data: Optional[Dict[str, Any]] = None

class WorkflowResponse(WorkflowBase):
    id: int
    status: str
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    success_rate: int
    execution_time: str
    nodes: int
    workflow_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class WorkflowList(BaseModel):
    workflows: List[WorkflowResponse]
    total: int
    page: int
    size: int