import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "AI Code Reviewer"
    OLLAMA_BASE_URL: str | None = os.getenv("OLLAMA_BASE_URL")
    MODEL_NAME: str | None = os.getenv("MODEL_NAME")

settings = Settings()