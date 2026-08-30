import pytest

from big_backend.config import Settings, get_settings


def test_settings_use_safe_local_defaults() -> None:
    settings = Settings()

    assert settings.environment == "local"
    assert settings.service_name == "big-backend"


def test_settings_read_the_northstar_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("NORTHSTAR_ENVIRONMENT", "test")
    monkeypatch.setenv("NORTHSTAR_SERVICE_NAME", "backend-test")

    settings = Settings()

    assert settings.environment == "test"
    assert settings.service_name == "backend-test"


def test_cached_settings_are_stable() -> None:
    get_settings.cache_clear()

    assert get_settings() is get_settings()

    get_settings.cache_clear()
