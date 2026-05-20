import json
from typing import AsyncGenerator

import httpx
from app.services.base_llm import BaseLLMService
from app.core.config import settings

class OllamaService(BaseLLMService):
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model_name = settings.MODEL_NAME
        
    async def generate_review(self, prompt: str) -> str:
        """
        Gửi prompt sang Ollama local và nhận kết quả trả về 
        """
        url = f"{self.base_url}/api/generate"
        
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,  # Nhiệt độ thấp để AI code nghiêm túc, không bịa đặt
                "top_p": 0.1
            }
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                print(f"Đang gửi request tới Ollama model: {self.model_name}")
                response = await client.post(url, json=payload)
                response.raise_for_status()
            
                result = response.json()
            
                return result.get("response", "")
            except httpx.HTTPError as e:
                print(f"Lỗi khi gọi Ollama API: {e}")
                return "Error: Unable to generate review from Ollama."
            except Exception as e:
                print(f"Lỗi không xác định: {e}")
                return "Error: An unexpected error occurred while generating review."
            
    async def generate_review_stream(self, prompt: str) -> AsyncGenerator[str, None]:
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": True,  # BẬT STREAMING
            "options": {
                "temperature": 0.1,
                "top_p": 0.1
            }
        }

        # client.stream() giúp giữ kết nối mở để hứng data liên tục
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                async with client.stream("POST", url, json=payload) as response:
                    response.raise_for_status()
                    
                    # Đọc từng dòng dữ liệu Ollama bắn về
                    async for line in response.aiter_lines():
                        if line:
                            data = json.loads(line)
                            # Trả về từng cụm từ (chunk) ngay lập tức bằng từ khóa 'yield'
                            yield data.get("response", "")
            except Exception as e:
                yield f"\n[Lỗi kết nối tới AI: {str(e)}]"
    
    