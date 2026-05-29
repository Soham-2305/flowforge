from sqlalchemy import Column, String, Float, Integer, DateTime, JSON
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class Project(Base):
    __tablename__ = "projects"

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name        = Column(String, nullable=False, default="Untitled simulation")
    geometry    = Column(String, default="Custom")
    status      = Column(String, default="idle")       # idle | running | done | error
    cd          = Column(Float, nullable=True)
    cl          = Column(Float, nullable=True)
    iterations  = Column(Integer, default=0)
    residual    = Column(Float, nullable=True)
    shapes      = Column(JSON, default=list)           # geometry shapes array
    solver_params = Column(JSON, default=dict)         # solver parameters
    boundaries  = Column(JSON, default=dict)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())