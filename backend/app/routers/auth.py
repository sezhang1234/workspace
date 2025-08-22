from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional
import jwt

from app.schemas.user import UserLogin
from app.schemas.common import ResponseModel
from app.core.config import settings

router = APIRouter()

# Mock user data for development
MOCK_USERS = [
    {
        "id": 1,
        "username": "admin",
        "email": "admin@jiuwen.com",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjqG",  # "admin123"
        "full_name": "系统管理员",
        "is_active": True,
        "is_superuser": True
    },
    {
        "id": 2,
        "username": "user1",
        "email": "user1@jiuwen.com",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjqG",  # "user123"
        "full_name": "测试用户1",
        "is_active": True,
        "is_superuser": False
    }
]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password (mock implementation)"""
    # In production, use proper password hashing
    return plain_password in ["admin123", "user123"]

def authenticate_user(username: str, password: str):
    """Authenticate user with username and password"""
    user = next((u for u in MOCK_USERS if u["username"] == username), None)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = next((u for u in MOCK_USERS if u["username"] == username), None)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

@router.post("/login", response_model=ResponseModel[dict])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """User login endpoint"""
    try:
        user = authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user["username"]}, expires_delta=access_token_expires
        )
        
        return ResponseModel(
            success=True,
            message="Login successful",
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "email": user["email"],
                    "full_name": user["full_name"],
                    "is_superuser": user["is_superuser"]
                }
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register", response_model=ResponseModel[dict])
async def register(user_data: UserLogin):
    """User registration endpoint"""
    try:
        # Check if username already exists
        if any(u["username"] == user_data.username for u in MOCK_USERS):
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Check if email already exists
        if any(u["email"] == user_data.email for u in MOCK_USERS):
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Create new user (in production, hash the password)
        new_user = {
            "id": max(u["id"] for u in MOCK_USERS) + 1,
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjqG",  # Mock hash
            "full_name": user_data.full_name or user_data.username,
            "is_active": True,
            "is_superuser": False
        }
        
        MOCK_USERS.append(new_user)
        
        return ResponseModel(
            success=True,
            message="User registered successfully",
            data={
                "id": new_user["id"],
                "username": new_user["username"],
                "email": new_user["email"],
                "full_name": new_user["full_name"]
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=ResponseModel[dict])
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return ResponseModel(
        success=True,
        message="User information retrieved successfully",
        data={
            "id": current_user["id"],
            "username": current_user["username"],
            "email": current_user["email"],
            "full_name": current_user["full_name"],
            "is_superuser": current_user["is_superuser"]
        }
    )

@router.post("/logout", response_model=ResponseModel[dict])
async def logout():
    """User logout endpoint"""
    # In a real application, you might want to blacklist the token
    return ResponseModel(
        success=True,
        message="Logout successful",
        data={}
    )