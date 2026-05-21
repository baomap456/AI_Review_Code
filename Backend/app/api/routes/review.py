from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.request import ReviewRequest
from app.services.ollama_service import OllamaService
from app.services.git_service import GitService
from app.services.project_service import ProjectService  # Import thêm service mới
from app.core.prompts import CODE_REVIEW_PROMPT, RAW_CODE_REVIEW_PROMPT, PROJECT_REVIEW_PROMPT

router = APIRouter()
ollama_service = OllamaService()
git_service = GitService()
project_service = ProjectService() 

@router.post("/stream")
async def analyze_code_stream(payload: ReviewRequest):
    prompt = "" # Biến rỗng chứa prompt sau khi xác định được chế độ

    # 🚀 CHẾ ĐỘ 1: Đánh giá Toàn bộ Kiến trúc Dự án (Trang ProjectReview)
    if payload.is_project_mode and payload.repo_path:
        try:
            detected_lang, project_code = project_service.analyze_project(payload.repo_path)
            prompt = PROJECT_REVIEW_PROMPT.format(
                language=detected_lang,
                project_code=project_code
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    # 🚀 CHẾ ĐỘ 2: Bóc tách Git Diff chưa commit (Trang GitReview)
    elif payload.repo_path:
        try:
            git_diff_text = git_service.get_diff(payload.repo_path)
            prompt = CODE_REVIEW_PROMPT.format(
                language=payload.language,
                git_diff=git_diff_text
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
            
    # 🚀 CHẾ ĐỘ 3: Dán code trực tiếp (Trang ManualReview)
    elif payload.raw_code:
        prompt = RAW_CODE_REVIEW_PROMPT.format(
            language=payload.language,
            code=payload.raw_code
        )
        
    # Báo lỗi nếu Client gửi payload rỗng vớ vẩn lên
    else:
        raise HTTPException(
            status_code=400, 
            detail="Vui lòng cung cấp 'repo_path' hoặc 'raw_code'."
        )

    # Động cơ Streaming cốt lõi giữ nguyên (Trung chuyển từ Ollama sang Frontend)
    async def event_generator():
        async for chunk in ollama_service.generate_review_stream(prompt):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")