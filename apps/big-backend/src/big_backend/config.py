from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed process configuration containing no business authorization state."""

    model_config = SettingsConfigDict(env_prefix="NORTHSTAR_", case_sensitive=False, extra="ignore")

    environment: Literal["local", "development", "test", "staging", "production"] = "local"
    service_name: str = Field(default="big-backend", min_length=1)


@lru_cache
def get_settings() -> Settings:
    return Settings()
