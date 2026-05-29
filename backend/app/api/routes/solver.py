from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.models.project import Project
from app.schemas.solver import SolverRunRequest, SolverStatus
from app.services.solver_service import run_mock_solver
from app.services.job_queue import job_queue
from app.api.routes.ws import manager
import asyncio

router = APIRouter(prefix="/solver", tags=["solver"])

@router.post("/run")
async def run_solver(
    request: SolverRunRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    project = await db.get(Project, request.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if job_queue.is_running(request.project_id):
        raise HTTPException(status_code=409, detail="Simulation already running")

    # Update project status
    project.status = "running"
    project.solver_params = request.params.model_dump()
    await db.flush()

    async def on_update(data: dict):
        await manager.broadcast(request.project_id, data)

    async def on_complete(data: dict):
        async with db.begin_nested():
            project.status = "done"
            project.iterations = data["iteration"]
            project.residual = data["residual"]
            project.cd = data["cd"]
            project.cl = data["cl"]
        await manager.broadcast(request.project_id, data)

    async def on_error(data: dict):
        project.status = data["status"]
        await manager.broadcast(request.project_id, data)

    async def job():
        await run_mock_solver(
            request.project_id,
            request.params.model_dump(),
            on_update, on_complete, on_error
        )

    background_tasks.add_task(job_queue.process.__func__, job_queue)
    job_queue.add_job(request.project_id, job)
    asyncio.create_task(job())

    return {"status": "started", "project_id": request.project_id}

@router.post("/stop/{project_id}")
async def stop_solver(project_id: str, db: AsyncSession = Depends(get_db)):
    job_queue.cancel(project_id)
    project = await db.get(Project, project_id)
    if project:
        project.status = "idle"
    return {"status": "stopped", "project_id": project_id}