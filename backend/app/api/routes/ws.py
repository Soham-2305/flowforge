from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
import json

router = APIRouter(tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, list[WebSocket]] = {}

    async def connect(self, project_id: str, ws: WebSocket):
        await ws.accept()
        if project_id not in self.active:
            self.active[project_id] = []
        self.active[project_id].append(ws)

    def disconnect(self, project_id: str, ws: WebSocket):
        if project_id in self.active:
            self.active[project_id].remove(ws)
            if not self.active[project_id]:
                del self.active[project_id]

    async def broadcast(self, project_id: str, data: Dict):
        connections = self.active.get(project_id, [])
        dead = []
        for ws in connections:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(project_id, ws)

manager = ConnectionManager()

@router.websocket("/ws/{project_id}")
async def websocket_endpoint(project_id: str, websocket: WebSocket):
    await manager.connect(project_id, websocket)
    try:
        while True:
            await websocket.receive_text()  # keep alive
    except WebSocketDisconnect:
        manager.disconnect(project_id, websocket)