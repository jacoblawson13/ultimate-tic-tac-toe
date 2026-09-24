from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.health import router as health_router
from app.core.settings import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # No startup/shutdown work needed yet (no database connection to open).
    yield


app = FastAPI(title=get_settings().app_name, lifespan=lifespan)
app.include_router(health_router, prefix="/api/v1")
