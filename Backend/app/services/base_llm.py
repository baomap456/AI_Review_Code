from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator

class BaseLLMService(ABC):
    """
    Interface gốc cho tất cả các dịch vụ AI.
    Đảm bảo tính Đóng/Mở (Open/Closed Principle) trong SOLID.
    
    """
    
    @abstractmethod
    async def generate_review(self,prompt: str) -> str:
        """
        Hàm này nhận vào một câu lệnh (prompt) và trả về câu trả lời của AI.
        Các class kế thừa bắt buộc phải viết logic cho hàm này.
        """
        pass
    
    @abstractmethod
    async def generate_review_stream(self, prompt: str) -> AsyncGenerator[str, None]:
        """
        Hàm này trả về dữ liệu dạng Stream (từng cụm từ).
        """
        yield ""