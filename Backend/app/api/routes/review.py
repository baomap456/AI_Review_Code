import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.request import ReviewRequest
from app.models.response import ReviewResponse
from app.services.ollama_service import OllamaService
from app.core.prompts import CODE_REVIEW_PROMPT
from app.services.git_service import GitService

router = APIRouter()
ollama_service = OllamaService()
git_service = GitService()

@router.post("/stream")
async def analyze_code_stream(payload: ReviewRequest):
    try:
       git_diff_text = git_service.get_diff(payload.repo_path)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    
    prompt = CODE_REVIEW_PROMPT.format(
        language=payload.language,
        git_diff=git_diff_text
    )

    # Hàm generator gói luồng stream từ Ollama để trả về qua HTTP
    async def event_generator():
        async for chunk in ollama_service.generate_review_stream(prompt):
            yield chunk

    # Trả về dữ liệu text thuần túy dưới dạng Stream
    return StreamingResponse(event_generator(), media_type="text/plain")
    
    