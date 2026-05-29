import asyncio
import math
import random
from typing import Callable

async def run_mock_solver(
    project_id: str,
    params: dict,
    on_update: Callable,
    on_complete: Callable,
    on_error: Callable,
):
    """
    Mock solver that simulates residual decay.
    Replace this with the real FVM solver when ready.
    """
    try:
        max_iter = params.get("maxIterations", 1000)
        tolerance = params.get("convergenceTolerance", 1e-5)
        residual = 1.0

        for i in range(1, max_iter + 1):
            await asyncio.sleep(0.02)  # simulate computation time

            # Residual decay with noise — mimics real solver behaviour
            decay = 0.994 + random.uniform(-0.003, 0.003)
            residual *= decay

            # Send update every 10 iterations
            if i % 10 == 0:
                await on_update({
                    "type": "progress",
                    "project_id": project_id,
                    "iteration": i,
                    "max_iterations": max_iter,
                    "residual": residual,
                    "status": "running",
                })

            if residual < tolerance:
                break

        # Compute mock Cd/Cl
        re = params.get("reynoldsNumber", 500)
        cd = 0.02 + 24 / re + 0.5 * random.uniform(0, 0.01)
        cl = 0.3 + random.uniform(-0.05, 0.05)

        await on_complete({
            "type": "complete",
            "project_id": project_id,
            "iteration": max_iter,
            "residual": residual,
            "cd": round(cd, 4),
            "cl": round(cl, 4),
            "status": "done",
        })

    except asyncio.CancelledError:
        await on_error({
            "type": "error",
            "project_id": project_id,
            "message": "Simulation cancelled",
            "status": "idle",
        })
    except Exception as e:
        await on_error({
            "type": "error",
            "project_id": project_id,
            "message": str(e),
            "status": "error",
        })