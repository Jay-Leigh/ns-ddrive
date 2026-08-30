from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/health", tags=["operations"], include_in_schema=False)


class HealthResponse(BaseModel):
    status: Literal["ok", "ready"]


@router.get("/live", response_model=HealthResponse)
def liveness() -> HealthResponse:
    """Report process liveness without touching external dependencies."""
    return HealthResponse(status="ok")


@router.get("/ready", response_model=HealthResponse)
def readiness() -> HealthResponse:
    """Report readiness for the dependency-free foundation application."""
    return HealthResponse(status="ready")
