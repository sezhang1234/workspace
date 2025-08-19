from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class WorkflowNodeBase(BaseModel):
    node_type: str
    name: str
    position_x: int = 0
    position_y: int = 0
    config: Optional[Dict[str, Any]] = None
    connections: Optional[Dict[str, Any]] = None


class WorkflowNodeCreate(WorkflowNodeBase):
    pass


class WorkflowNodeUpdate(BaseModel):
    node_type: Optional[str] = None
    name: Optional[str] = None
    position_x: Optional[int] = None
    position_y: Optional[int] = None
    config: Optional[Dict[str, Any]] = None
    connections: Optional[Dict[str, Any]] = None


class WorkflowNodeResponse(WorkflowNodeBase):
    id: int
    workflow_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None


class WorkflowCreate(WorkflowBase):
    nodes: Optional[List[WorkflowNodeCreate]] = None


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class WorkflowResponse(WorkflowBase):
    id: int
    is_active: bool
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    nodes: List[WorkflowNodeResponse] = []
    
    class Config:
        from_attributes = True