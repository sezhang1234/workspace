from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ModelBase(BaseModel):
    name: str
    provider: str
    model_type: str
    base_url: Optional[str] = None
    config: Optional[Dict[str, Any]] = None


class ModelCreate(ModelBase):
    api_key: str


class ModelUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    model_type: Optional[str] = None
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    is_default: Optional[bool] = None


class ModelResponse(ModelBase):
    id: int
    is_active: bool
    is_default: bool
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ModelTestRequest(BaseModel):
    model_id: int
    test_prompt: str = "Hello, this is a test message."