from pydantic import BaseModel
from typing import Literal

class SolverParams(BaseModel):
    reynoldsNumber: float = 500
    viscosity: float = 0.001
    inletVelocity: float = 1.0
    turbulenceModel: Literal["laminar", "k-epsilon"] = "laminar"
    maxIterations: int = 1000
    convergenceTolerance: float = 1e-5

class SolverRunRequest(BaseModel):
    project_id: str
    params: SolverParams

class SolverStatus(BaseModel):
    project_id: str
    status: str
    iteration: int
    max_iterations: int
    residual: float | None = None
    message: str = ""