import pytest


@pytest.fixture
def anyio_backend() -> str:
    """Run async tests under asyncio only (not also trio, which isn't installed)."""
    return "asyncio"
