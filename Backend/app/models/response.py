from pydantic import BaseModel

class ReviewResponse(BaseModel):
    review_commits : str
    commit_message : str
    