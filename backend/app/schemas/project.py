from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str = "Untitled simulation"
    geometry: str = "Custom"

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    shapes: Optional[list] = None
    solver_params: Optional[dict] = None
    boundaries: Optional[dict] = None

class ProjectOut(BaseModel):
    id: str
    name: str
    geometry: str
    status: str
    cd: Optional[float] = None
    cl: Optional[float] = None
    iterations: int
    residual: Optional[float] = None
    shapes: list
    solver_params: dict
    boundaries: dict
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True