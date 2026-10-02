from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

# Every error the API returns uses the same envelope: {"code": ..., "detail": ...}.
_KNOWN_ERRORS: dict[int, tuple[str, str]] = {
    404: ("not_found", "The requested resource was not found."),
    405: ("method_not_allowed", "That HTTP method is not allowed for this resource."),
}


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def handle_http_exception(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        code, detail = _KNOWN_ERRORS.get(exc.status_code, ("http_error", str(exc.detail)))
        return JSONResponse(
            status_code=exc.status_code,
            content={"code": code, "detail": detail},
            headers=exc.headers,
        )
