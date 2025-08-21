from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowResponse, WorkflowList
from app.schemas.common import ResponseModel, PaginationParams

router = APIRouter()

# Mock data for development
MOCK_WORKFLOWS = [
    {
        "id": 1,
        "name": "智能客服工作流",
        "description": "自动回答客户常见问题的智能客服系统",
        "status": "running",
        "trigger": "webhook",
        "last_run": "2024-01-15T10:30:00",
        "next_run": "2024-01-15T11:00:00",
        "success_rate": 95,
        "execution_time": "2.3s",
        "nodes": 8,
        "tags": ["客服", "自动化", "AI"],
        "workflow_data": {"nodes": [], "edges": []},
        "created_at": "2024-01-10T09:00:00",
        "updated_at": "2024-01-15T10:30:00"
    },
    {
        "id": 2,
        "name": "数据分析工作流",
        "description": "自动分析业务数据并生成报告",
        "status": "stopped",
        "trigger": "scheduled",
        "last_run": "2024-01-14T23:00:00",
        "next_run": "2024-01-15T23:00:00",
        "success_rate": 88,
        "execution_time": "15.2s",
        "nodes": 12,
        "tags": ["数据分析", "报告", "定时"],
        "workflow_data": {"nodes": [], "edges": []},
        "created_at": "2024-01-08T14:30:00",
        "updated_at": "2024-01-14T23:00:00"
    },
    {
        "id": 3,
        "name": "内容生成工作流",
        "description": "自动生成营销内容和社交媒体帖子",
        "status": "completed",
        "trigger": "manual",
        "last_run": "2024-01-15T08:00:00",
        "next_run": None,
        "success_rate": 92,
        "execution_time": "8.7s",
        "nodes": 6,
        "tags": ["内容生成", "营销", "社交媒体"],
        "workflow_data": {"nodes": [], "edges": []},
        "created_at": "2024-01-12T11:15:00",
        "updated_at": "2024-01-15T08:00:00"
    }
]

@router.get("/", response_model=ResponseModel[WorkflowList])
async def get_workflows(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by name or description")
):
    """Get all workflows with pagination and filtering"""
    try:
        # Filter workflows
        filtered_workflows = MOCK_WORKFLOWS.copy()
        
        if status:
            filtered_workflows = [w for w in filtered_workflows if w["status"] == status]
        
        if search:
            search_lower = search.lower()
            filtered_workflows = [
                w for w in filtered_workflows 
                if search_lower in w["name"].lower() or 
                   (w["description"] and search_lower in w["description"].lower())
            ]
        
        # Pagination
        total = len(filtered_workflows)
        start_idx = (page - 1) * size
        end_idx = start_idx + size
        paginated_workflows = filtered_workflows[start_idx:end_idx]
        
        # Convert to response models
        workflow_responses = [WorkflowResponse(**w) for w in paginated_workflows]
        
        return ResponseModel(
            success=True,
            message="Workflows retrieved successfully",
            data=WorkflowList(
                workflows=workflow_responses,
                total=total,
                page=page,
                size=size
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{workflow_id}", response_model=ResponseModel[WorkflowResponse])
async def get_workflow(workflow_id: int):
    """Get a specific workflow by ID"""
    try:
        workflow = next((w for w in MOCK_WORKFLOWS if w["id"] == workflow_id), None)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        return ResponseModel(
            success=True,
            message="Workflow retrieved successfully",
            data=WorkflowResponse(**workflow)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ResponseModel[WorkflowResponse])
async def create_workflow(workflow: WorkflowCreate):
    """Create a new workflow"""
    try:
        # Generate new ID (in real app, this would be from database)
        new_id = max(w["id"] for w in MOCK_WORKFLOWS) + 1
        
        new_workflow = {
            "id": new_id,
            "name": workflow.name,
            "description": workflow.description,
            "status": "stopped",
            "trigger": workflow.trigger,
            "last_run": None,
            "next_run": None,
            "success_rate": 0,
            "execution_time": "0s",
            "nodes": len(workflow.workflow_data.get("nodes", [])) if workflow.workflow_data else 0,
            "tags": workflow.tags,
            "workflow_data": workflow.workflow_data,
            "created_at": datetime.now().isoformat(),
            "updated_at": None
        }
        
        MOCK_WORKFLOWS.append(new_workflow)
        
        return ResponseModel(
            success=True,
            message="Workflow created successfully",
            data=WorkflowResponse(**new_workflow)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{workflow_id}", response_model=ResponseModel[WorkflowResponse])
async def update_workflow(workflow_id: int, workflow_update: WorkflowUpdate):
    """Update an existing workflow"""
    try:
        workflow_idx = next((i for i, w in enumerate(MOCK_WORKFLOWS) if w["id"] == workflow_id), None)
        if workflow_idx is None:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        # Update workflow
        current_workflow = MOCK_WORKFLOWS[workflow_idx]
        update_data = workflow_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            if key == "workflow_data" and value:
                current_workflow["nodes"] = len(value.get("nodes", []))
            current_workflow[key] = value
        
        current_workflow["updated_at"] = datetime.now().isoformat()
        
        return ResponseModel(
            success=True,
            message="Workflow updated successfully",
            data=WorkflowResponse(**current_workflow)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{workflow_id}", response_model=ResponseModel[dict])
async def delete_workflow(workflow_id: int):
    """Delete a workflow"""
    try:
        workflow_idx = next((i for i, w in enumerate(MOCK_WORKFLOWS) if w["id"] == workflow_id), None)
        if workflow_idx is None:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        deleted_workflow = MOCK_WORKFLOWS.pop(workflow_idx)
        
        return ResponseModel(
            success=True,
            message="Workflow deleted successfully",
            data={"id": deleted_workflow["id"], "name": deleted_workflow["name"]}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{workflow_id}/run", response_model=ResponseModel[dict])
async def run_workflow(workflow_id: int):
    """Run a workflow"""
    try:
        workflow = next((w for w in MOCK_WORKFLOWS if w["id"] == workflow_id), None)
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        if workflow["status"] == "running":
            raise HTTPException(status_code=400, detail="Workflow is already running")
        
        # Simulate workflow execution
        workflow["status"] = "running"
        workflow["last_run"] = datetime.now().isoformat()
        workflow["updated_at"] = datetime.now().isoformat()
        
        return ResponseModel(
            success=True,
            message="Workflow started successfully",
            data={"id": workflow_id, "status": "running"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))