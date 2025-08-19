from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class PromptBase(BaseModel):
    name: str
    description: Optional[str] = None
    content: str
    variables: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None


class PromptCreate(PromptBase):
    pass


class PromptUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None


class PromptResponse(PromptBase):
    id: int
    version: int
    is_active: bool
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True