from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def get_health() -> dict[str, str]:
    """Simple liveness check: if this responds, the server is up."""
    return {"status": "ok"}
