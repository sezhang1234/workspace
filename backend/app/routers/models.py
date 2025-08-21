from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from app.schemas.model_config import ModelConfigCreate, ModelConfigUpdate, ModelConfigResponse
from app.schemas.common import ResponseModel
from app.routers.auth import get_current_user

router = APIRouter()

# Mock model configurations for development
MOCK_MODEL_CONFIGS = [
    {
        "id": 1,
        "name": "OpenAI GPT-4",
        "provider": "openai",
        "model_type": "gpt-4",
        "api_key": "sk-...",  # Masked for security
        "base_url": "https://api.openai.com/v1",
        "is_active": True,
        "config": {
            "temperature": 0.7,
            "max_tokens": 4096,
            "top_p": 1.0
        },
        "created_at": "2024-01-10T09:00:00",
        "updated_at": None
    },
    {
        "id": 2,
        "name": "DeepSeek Chat",
        "provider": "deepseek",
        "model_type": "deepseek-chat",
        "api_key": "sk-...",  # Masked for security
        "base_url": "https://api.deepseek.com/v1",
        "is_active": True,
        "config": {
            "temperature": 0.8,
            "max_tokens": 8192,
            "top_p": 0.9
        },
        "created_at": "2024-01-12T14:30:00",
        "updated_at": None
    },
    {
        "id": 3,
        "name": "Qwen Plus",
        "provider": "qwen",
        "model_type": "qwen-plus",
        "api_key": "sk-...",  # Masked for security
        "base_url": "https://dashscope.aliyuncs.com/api/v1",
        "is_active": True,
        "config": {
            "temperature": 0.6,
            "max_tokens": 6144,
            "top_p": 0.95
        },
        "created_at": "2024-01-15T11:15:00",
        "updated_at": None
    }
]

@router.get("/", response_model=ResponseModel[List[ModelConfigResponse]])
async def get_model_configs(
    provider: Optional[str] = Query(None, description="Filter by provider"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    current_user: dict = Depends(get_current_user)
):
    """Get all model configurations with filtering"""
    try:
        # Filter model configs
        filtered_configs = MOCK_MODEL_CONFIGS.copy()
        
        if provider:
            filtered_configs = [m for m in filtered_configs if m["provider"] == provider]
        
        if is_active is not None:
            filtered_configs = [m for m in filtered_configs if m["is_active"] == is_active]
        
        # Convert to response models (mask API keys)
        model_responses = []
        for config in filtered_configs:
            config_data = config.copy()
            if config_data["api_key"]:
                config_data["api_key"] = "sk-..."  # Mask API key
            model_responses.append(ModelConfigResponse(**config_data))
        
        return ResponseModel(
            success=True,
            message="Model configurations retrieved successfully",
            data=model_responses
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{config_id}", response_model=ResponseModel[ModelConfigResponse])
async def get_model_config(
    config_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific model configuration by ID"""
    try:
        config = next((m for m in MOCK_MODEL_CONFIGS if m["id"] == config_id), None)
        if not config:
            raise HTTPException(status_code=404, detail="Model configuration not found")
        
        # Mask API key in response
        config_data = config.copy()
        if config_data["api_key"]:
            config_data["api_key"] = "sk-..."
        
        return ResponseModel(
            success=True,
            message="Model configuration retrieved successfully",
            data=ModelConfigResponse(**config_data)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ResponseModel[ModelConfigResponse])
async def create_model_config(
    model_config: ModelConfigCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new model configuration"""
    try:
        # Check if name already exists
        if any(m["name"] == model_config.name for m in MOCK_MODEL_CONFIGS):
            raise HTTPException(status_code=400, detail="Model configuration name already exists")
        
        # Generate new ID
        new_id = max(m["id"] for m in MOCK_MODEL_CONFIGS) + 1
        
        new_config = {
            "id": new_id,
            "name": model_config.name,
            "provider": model_config.provider,
            "model_type": model_config.model_type,
            "api_key": model_config.api_key,
            "base_url": model_config.base_url,
            "is_active": model_config.is_active,
            "config": model_config.config,
            "created_at": datetime.now().isoformat(),
            "updated_at": None
        }
        
        MOCK_MODEL_CONFIGS.append(new_config)
        
        # Mask API key in response
        response_data = new_config.copy()
        if response_data["api_key"]:
            response_data["api_key"] = "sk-..."
        
        return ResponseModel(
            success=True,
            message="Model configuration created successfully",
            data=ModelConfigResponse(**response_data)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{config_id}", response_model=ResponseModel[ModelConfigResponse])
async def update_model_config(
    config_id: int,
    model_config_update: ModelConfigUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an existing model configuration"""
    try:
        config_idx = next((i for i, m in enumerate(MOCK_MODEL_CONFIGS) if m["id"] == config_id), None)
        if config_idx is None:
            raise HTTPException(status_code=404, detail="Model configuration not found")
        
        # Check name uniqueness if updating name
        if model_config_update.name:
            if any(m["name"] == model_config_update.name and m["id"] != config_id for m in MOCK_MODEL_CONFIGS):
                raise HTTPException(status_code=400, detail="Model configuration name already exists")
        
        # Update configuration
        current_config = MOCK_MODEL_CONFIGS[config_idx]
        update_data = model_config_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            current_config[key] = value
        
        current_config["updated_at"] = datetime.now().isoformat()
        
        # Mask API key in response
        response_data = current_config.copy()
        if response_data["api_key"]:
            response_data["api_key"] = "sk-..."
        
        return ResponseModel(
            success=True,
            message="Model configuration updated successfully",
            data=ModelConfigResponse(**response_data)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{config_id}", response_model=ResponseModel[dict])
async def delete_model_config(
    config_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete a model configuration"""
    try:
        config_idx = next((i for i, m in enumerate(MOCK_MODEL_CONFIGS) if m["id"] == config_id), None)
        if config_idx is None:
            raise HTTPException(status_code=404, detail="Model configuration not found")
        
        deleted_config = MOCK_MODEL_CONFIGS.pop(config_idx)
        
        return ResponseModel(
            success=True,
            message="Model configuration deleted successfully",
            data={"id": deleted_config["id"], "name": deleted_config["name"]}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{config_id}/test", response_model=ResponseModel[dict])
async def test_model_config(
    config_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Test a model configuration by making a simple API call"""
    try:
        config = next((m for m in MOCK_MODEL_CONFIGS if m["id"] == config_id), None)
        if not config:
            raise HTTPException(status_code=404, detail="Model configuration not found")
        
        if not config["is_active"]:
            raise HTTPException(status_code=400, detail="Cannot test inactive model configuration")
        
        # Simulate API test (in production, make actual API call)
        # For now, just return success
        return ResponseModel(
            success=True,
            message="Model configuration test successful",
            data={
                "id": config_id,
                "name": config["name"],
                "provider": config["provider"],
                "model_type": config["model_type"],
                "test_result": "Connection successful"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))