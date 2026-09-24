from functools import lru_cache

from pydantic import BaseModel


class Settings(BaseModel):
    """App-wide configuration, read once and cached."""

    app_name: str = "Ultimate Tic-Tac-Toe API"


@lru_cache
def get_settings() -> Settings:
    return Settings()
