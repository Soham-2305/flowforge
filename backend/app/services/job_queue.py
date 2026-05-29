import asyncio
from typing import Callable, Any
from collections import deque
import uuid

class JobQueue:
    def __init__(self):
        self._queue: deque = deque()
        self._running: dict[str, asyncio.Task] = {}
        self._callbacks: dict[str, list[Callable]] = {}

    def add_job(self, job_id: str, coro_fn: Callable, *args, **kwargs):
        self._queue.append((job_id, coro_fn, args, kwargs))

    async def process(self):
        while self._queue:
            job_id, fn, args, kwargs = self._queue.popleft()
            task = asyncio.create_task(fn(*args, **kwargs))
            self._running[job_id] = task
            try:
                await task
            except Exception as e:
                print(f"Job {job_id} failed: {e}")
            finally:
                self._running.pop(job_id, None)

    def cancel(self, job_id: str):
        task = self._running.get(job_id)
        if task:
            task.cancel()
            self._running.pop(job_id, None)

    def is_running(self, job_id: str) -> bool:
        return job_id in self._running

# Global singleton
job_queue = JobQueue()