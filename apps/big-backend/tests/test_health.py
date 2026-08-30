from fastapi.testclient import TestClient
from starlette import status

from big_backend.config import Settings
from big_backend.main import create_application


def test_liveness_reports_process_health() -> None:
    client = TestClient(create_application(Settings(environment="test")))

    response = client.get("/health/live")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok"}


def test_readiness_reports_foundation_readiness() -> None:
    client = TestClient(create_application(Settings(environment="test")))

    response = client.get("/health/ready")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ready"}


def test_unapproved_combined_openapi_is_not_published() -> None:
    client = TestClient(create_application(Settings(environment="test")))

    assert client.get("/openapi.json").status_code == status.HTTP_404_NOT_FOUND
    assert client.get("/docs").status_code == status.HTTP_404_NOT_FOUND
