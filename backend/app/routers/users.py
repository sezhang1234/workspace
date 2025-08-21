from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.schemas.common import ResponseModel, PaginationParams
from app.routers.auth import get_current_user

router = APIRouter()

# Mock user data (same as in auth.py)
MOCK_USERS = [
    {
        "id": 1,
        "username": "admin",
        "email": "admin@jiuwen.com",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjqG",
        "full_name": "系统管理员",
        "is_active": True,
        "is_superuser": True
    },
    {
        "id": 2,
        "username": "user1",
        "email": "user1@jiuwen.com",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjqG",
        "full_name": "测试用户1",
        "is_active": True,
        "is_superuser": False
    }
]

@router.get("/", response_model=ResponseModel[List[UserResponse]])
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    search: Optional[str] = Query(None, description="Search by username or email"),
    current_user: dict = Depends(get_current_user)
):
    """Get all users with pagination and filtering"""
    try:
        # Only superusers can list all users
        if not current_user["is_superuser"]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        # Filter users
        filtered_users = MOCK_USERS.copy()
        
        if search:
            search_lower = search.lower()
            filtered_users = [
                u for u in filtered_users 
                if search_lower in u["username"].lower() or 
                   search_lower in u["email"].lower()
            ]
        
        # Pagination
        total = len(filtered_users)
        start_idx = (page - 1) * size
        end_idx = start_idx + size
        paginated_users = filtered_users[start_idx:end_idx]
        
        # Convert to response models (exclude password)
        user_responses = []
        for user in paginated_users:
            user_data = {k: v for k, v in user.items() if k != "hashed_password"}
            user_responses.append(UserResponse(**user_data))
        
        return ResponseModel(
            success=True,
            message="Users retrieved successfully",
            data=user_responses
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}", response_model=ResponseModel[UserResponse])
async def get_user(
    user_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific user by ID"""
    try:
        # Users can only view their own profile, superusers can view any
        if not current_user["is_superuser"] and current_user["id"] != user_id:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        user = next((u for u in MOCK_USERS if u["id"] == user_id), None)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Exclude password from response
        user_data = {k: v for k, v in user.items() if k != "hashed_password"}
        
        return ResponseModel(
            success=True,
            message="User retrieved successfully",
            data=UserResponse(**user_data)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}", response_model=ResponseModel[UserResponse])
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a user"""
    try:
        # Users can only update their own profile, superusers can update any
        if not current_user["is_superuser"] and current_user["id"] != user_id:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        user_idx = next((i for i, u in enumerate(MOCK_USERS) if u["id"] == user_id), None)
        if user_idx is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user
        current_user_data = MOCK_USERS[user_idx]
        update_data = user_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            current_user_data[key] = value
        
        # Exclude password from response
        user_data = {k: v for k, v in current_user_data.items() if k != "hashed_password"}
        
        return ResponseModel(
            success=True,
            message="User updated successfully",
            data=UserResponse(**user_data)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_id}", response_model=ResponseModel[dict])
async def delete_user(
    user_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete a user"""
    try:
        # Only superusers can delete users
        if not current_user["is_superuser"]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        # Prevent self-deletion
        if current_user["id"] == user_id:
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
        user_idx = next((i for i, u in enumerate(MOCK_USERS) if u["id"] == user_id), None)
        if user_idx is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        deleted_user = MOCK_USERS.pop(user_idx)
        
        return ResponseModel(
            success=True,
            message="User deleted successfully",
            data={"id": deleted_user["id"], "username": deleted_user["username"]}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))