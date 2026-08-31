from fastapi import FastAPI

from big_backend.api.health import router as health_router
from big_backend.config import Settings, get_settings


def create_application(settings: Settings | None = None) -> FastAPI:
    """Create one backend process without publishing an unapproved combined OpenAPI contract."""
    resolved_settings = settings or get_settings()
    application = FastAPI(
        title="BIG Backend",
        version="0.0.0",
        docs_url=None,
        openapi_url=None,
        redoc_url=None,
    )
    application.state.settings = resolved_settings
    application.include_router(health_router)
    return application


app = create_application()
