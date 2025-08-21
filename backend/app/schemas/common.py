from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List

T = TypeVar('T')

class ResponseModel(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    error: Optional[str] = None

class PaginationParams(BaseModel):
    page: int = 1
    size: int = 20
    total: Optional[int] = None

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    pagination: PaginationParams