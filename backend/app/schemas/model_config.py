from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class ModelConfigBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    provider: str = Field(..., description="AI model provider (openai, anthropic, deepseek, qwen, etc.)")
    model_type: str = Field(..., description="Specific model name (gpt-4, claude-3, etc.)")
    base_url: Optional[str] = Field(None, description="Custom API endpoint URL")
    is_active: bool = Field(default=True)
    config: Dict[str, Any] = Field(default_factory=dict)

class ModelConfigCreate(ModelConfigBase):
    api_key: Optional[str] = Field(None, description="API key for the model provider")

class ModelConfigUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    provider: Optional[str] = None
    model_type: Optional[str] = None
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    is_active: Optional[bool] = None
    config: Optional[Dict[str, Any]] = None

class ModelConfigResponse(ModelConfigBase):
    id: int
    created_at: str
    updated_at: Optional[str] = None
    
    class Config:
        from_attributes = True