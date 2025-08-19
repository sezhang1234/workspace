from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    system_prompt: str
    model_config: Optional[Dict[str, Any]] = None
    tools_config: Optional[Dict[str, Any]] = None


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    model_config: Optional[Dict[str, Any]] = None
    tools_config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class AgentResponse(AgentBase):
    id: int
    is_active: bool
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True