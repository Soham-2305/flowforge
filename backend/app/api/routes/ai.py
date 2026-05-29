from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/ai", tags=["ai"])

class PredictRequest(BaseModel):
    reynolds_number: float
    geometry_type: str
    width: Optional[float] = None
    height: Optional[float] = None

class PredictResponse(BaseModel):
    predicted_cd: float
    predicted_cl: float
    confidence: float
    note: str

class DiagnoseRequest(BaseModel):
    project_id: str
    cd: float
    cl: float
    reynolds_number: float

class DiagnoseResponse(BaseModel):
    suggestions: list[str]
    severity: str

@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    # Mock surrogate prediction — real ML model plugs in here
    import random
    re = request.reynolds_number
    cd = round(0.02 + 24 / re + random.uniform(0, 0.005), 4)
    cl = round(0.35 + random.uniform(-0.05, 0.05), 4)
    return PredictResponse(
        predicted_cd=cd,
        predicted_cl=cl,
        confidence=0.91,
        note="Surrogate model prediction (v0.1 — trained on UIUC dataset)"
    )

@router.post("/diagnose", response_model=DiagnoseResponse)
async def diagnose(request: DiagnoseRequest):
    suggestions = []
    severity = "low"

    if request.cd > 0.05:
        suggestions.append("High drag detected — consider reducing frontal area or sharpening leading edge")
        severity = "high"
    if request.cl < 0.1:
        suggestions.append("Low lift — increase angle of attack or add camber to geometry")
    if request.reynolds_number < 100:
        suggestions.append("Very low Re — flow is highly viscous, expect creeping flow behaviour")
    if not suggestions:
        suggestions.append("Design looks good — drag and lift coefficients within expected range")

    return DiagnoseResponse(suggestions=suggestions, severity=severity)