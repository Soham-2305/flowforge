from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/mesh", tags=["mesh"])

class MeshRequest(BaseModel):
    shapes: list
    cell_size: float = 0.05
    refinement_level: int = 2

class MeshResponse(BaseModel):
    cell_count: int
    node_count: int
    quality: float
    status: str

@router.post("/generate", response_model=MeshResponse)
async def generate_mesh(request: MeshRequest):
    # Mock mesh generation — real Gmsh integration comes in solver phase
    area = sum(
        abs(s.get("w", 0) * s.get("h", 0))
        for s in request.shapes
    )
    cell_count = max(100, int(area / (request.cell_size ** 2)))
    return MeshResponse(
        cell_count=cell_count,
        node_count=int(cell_count * 1.4),
        quality=0.87,
        status="ok",
    )