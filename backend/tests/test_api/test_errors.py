import pytest
from httpx import ASGITransport, AsyncClient, Response

from app.main import app


async def request(method: str, path: str) -> Response:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        return await client.request(method, path)


@pytest.mark.anyio
async def test_unknown_path_returns_not_found_envelope() -> None:
    response = await request("GET", "/api/v1/does-not-exist")

    assert response.status_code == 404
    assert response.json() == {
        "code": "not_found",
        "detail": "The requested resource was not found.",
    }


@pytest.mark.anyio
async def test_wrong_method_returns_method_not_allowed_envelope() -> None:
    response = await request("POST", "/api/v1/health")

    assert response.status_code == 405
    assert response.json() == {
        "code": "method_not_allowed",
        "detail": "That HTTP method is not allowed for this resource.",
    }
    # The Allow header tells clients which methods ARE permitted, so it must survive.
    assert response.headers["allow"] == "GET"
