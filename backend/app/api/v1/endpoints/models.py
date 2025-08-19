from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_current_active_user
from app.core.database import get_db
from app.models.user import User
from app.models.model import Model
from app.schemas.model import ModelCreate, ModelUpdate, ModelResponse, ModelTestRequest

router = APIRouter()


@router.post("/", response_model=ModelResponse)
def create_model(
    model: ModelCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new AI model configuration"""
    # Check if model name already exists for this user
    existing_model = db.query(Model).filter(
        Model.name == model.name,
        Model.created_by == current_user.id
    ).first()
    
    if existing_model:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Model name already exists"
        )
    
    # If this is the first model or marked as default, set as default
    if model.config and model.config.get("is_default", False):
        # Remove default from other models
        db.query(Model).filter(
            Model.created_by == current_user.id,
            Model.is_default == True
        ).update({"is_default": False})
    
    db_model = Model(
        **model.dict(),
        created_by=current_user.id
    )
    
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    
    return db_model


@router.get("/", response_model=List[ModelResponse])
def get_models(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all models for current user"""
    models = db.query(Model).filter(Model.created_by == current_user.id).all()
    return models


@router.get("/{model_id}", response_model=ModelResponse)
def get_model(
    model_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get model by ID"""
    model = db.query(Model).filter(
        Model.id == model_id,
        Model.created_by == current_user.id
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    return model


@router.put("/{model_id}", response_model=ModelResponse)
def update_model(
    model_id: int,
    model_update: ModelUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update model configuration"""
    model = db.query(Model).filter(
        Model.id == model_id,
        Model.created_by == current_user.id
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    update_data = model_update.dict(exclude_unset=True)
    
    # Handle default model logic
    if "is_default" in update_data and update_data["is_default"]:
        # Remove default from other models
        db.query(Model).filter(
            Model.created_by == current_user.id,
            Model.is_default == True
        ).update({"is_default": False})
    
    for field, value in update_data.items():
        setattr(model, field, value)
    
    db.commit()
    db.refresh(model)
    
    return model


@router.delete("/{model_id}")
def delete_model(
    model_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete model configuration"""
    model = db.query(Model).filter(
        Model.id == model_id,
        Model.created_by == current_user.id
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    db.delete(model)
    db.commit()
    
    return {"message": "Model deleted successfully"}


@router.post("/{model_id}/test")
def test_model(
    model_id: int,
    test_request: ModelTestRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Test model configuration with a sample prompt"""
    model = db.query(Model).filter(
        Model.id == model_id,
        Model.created_by == current_user.id
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    if not model.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Model is not active"
        )
    
    # Here you would implement the actual model testing logic
    # For now, return a mock response
    return {
        "model_id": model_id,
        "test_prompt": test_request.test_prompt,
        "status": "success",
        "response": f"Mock response from {model.provider}/{model.model_type}",
        "timestamp": "2024-01-01T00:00:00Z"
    }