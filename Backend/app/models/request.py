from pydantic import BaseModel
from typing import Optional

class ReviewRequest(BaseModel):
    # Dùng cho trang GitReview và ProjectReview
    repo_path: Optional[str] = None  
    
    # Dùng cho trang ManualReview
    raw_code: Optional[str] = None   
    
    # Ngôn ngữ (Project Mode có thể gửi lên 'auto')
    language: Optional[str] = "python"
    
    # Cờ đánh dấu nếu gọi từ trang ProjectReview
    is_project_mode: Optional[bool] = False