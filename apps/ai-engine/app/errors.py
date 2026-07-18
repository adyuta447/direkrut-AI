"""Exception handler global biar semua error dari ai-engine punya bentuk
JSON yang sama dengan api-go (internal/httpx.WriteError):
{"error": {"code", "message"}} -- frontend cuma perlu satu cara parse error
dari kedua service, gak perlu tau service mana yang jawab.
"""

from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def _error_response(status_code: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"error": {"code": code, "message": message}})


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def handle_http_exception(request: Request, exc: HTTPException) -> JSONResponse:
        return _error_response(exc.status_code, "http_error", str(exc.detail))

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        return _error_response(422, "validation_failed", str(exc.errors()))

    @app.exception_handler(NotImplementedError)
    async def handle_not_implemented(request: Request, exc: NotImplementedError) -> JSONResponse:
        return _error_response(501, "not_implemented", "belum diimplementasi")

    @app.exception_handler(Exception)
    async def handle_unexpected(request: Request, exc: Exception) -> JSONResponse:
        return _error_response(500, "internal_error", "terjadi kesalahan internal")
