# BIG backend

Authoritative FastAPI backend foundation for the BIG operational platform.

Run the local foundation server from the repository root:

```cmd
uv run --directory apps/big-backend uvicorn --app-dir src big_backend.main:app --port 8000
```

Operational endpoints:

- `GET /health/live` — confirms that the application process can serve requests.
- `GET /health/ready` — confirms readiness for the currently scaffolded, dependency-free application. Database readiness will be added when database wiring is introduced.

The scaffold contains no authentication, authorization, domain schema, migration revision or J0/J1 business endpoint. API documentation is intentionally disabled until the separate staff and client-review OpenAPI publication boundaries are implemented.

## Quality commands

```cmd
uv run --directory apps/big-backend ruff format --check .
uv run --directory apps/big-backend ruff check .
uv run --directory apps/big-backend mypy
uv run --directory apps/big-backend pytest
```

Alembic is configured for centrally orchestrated commands only. Never run migrations during application startup. Do not create the first revision until schema ownership and role grants are approved under ADR 0008.
