from pydantic import BaseModel
from typing import Optional

class ReviewRequest(BaseModel):
    repo_path: str
    language: Optional[str] = "python"