# 🤖 AI Architecture & Code Reviewer

Một hệ thống trợ lý ảo chuyên dụng (Local AI) hỗ trợ phân tích mã nguồn, đánh giá kiến trúc hệ thống và phát hiện lỗi trực tiếp trên máy cá nhân, đảm bảo tính bảo mật tuyệt đối cho Source Code.

Dự án được thiết kế theo chuẩn **Clean Architecture** và các nguyên tắc **SOLID**, ứng dụng cơ chế **Asynchronous Streaming** để mang lại trải nghiệm phản hồi theo thời gian thực (Real-time).

---

## ✨ Tính năng nổi bật (Core Features)

Hệ thống cung cấp 3 chế độ phân tích chuyên sâu:

1. 📂 **Project Architecture Review (Quét toàn bộ dự án):**
   - Thuật toán Heuristic tự động lặn sâu vào thư mục (`os.walk`), loại bỏ các file/folder rác (`node_modules`, `venv`, v.v.).
   - Tự động nhận diện ngôn ngữ lập trình chính của dự án dựa trên tần suất đuôi file.
   - AI đóng vai trò Software Architect để đánh giá tổng thể về Separation of Concerns, Modularity và các điểm nghẽn hệ thống.

2. 🌿 **Git Diff Review (Quét thay đổi chờ Commit):**
   - Tích hợp trực tiếp với Git local.
   - Bóc tách tự động các dòng code mới thêm/chỉnh sửa (Uncommitted changes).
   - Bắt lỗi Logic và Syntax trước khi đẩy code lên repository chung.

3. 📝 **Manual Snippet Review (Chấm điểm Code thuần):**
   - Hỗ trợ dán các đoạn code đơn lẻ để AI phân tích nhanh.
   - Cung cấp giải pháp Refactor code chuẩn Clean Code, hiển thị trực quan với Syntax Highlighter chuẩn VS Code.

⚡ **Real-time Streaming:** Ứng dụng Server-Sent Events (SSE) / ReadableStream để đổ dữ liệu từ GPU (Ollama) lên trình duyệt ngay lập tức, không gây nghẽn cổ chai bộ nhớ (Memory Bottleneck).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

**Frontend:**
- React (TypeScript) + Vite
- Tailwind CSS (Styling & Responsive)
- React Router DOM (Single Page Application routing)
- React Markdown & React Syntax Highlighter

**Backend:**
- Python 3 + FastAPI (High performance async framework)
- Ollama (Chạy Local LLM: Qwen2.5-Coder hoặc Llama)
- GitPython (Tương tác hệ thống Git Local)
- HTTPX (Xử lý Async Networking)

---

## 🚀 Hướng dẫn Cài đặt & Chạy dự án (Installation)

### 1. Yêu cầu hệ thống (Prerequisites)
- **Node.js** (v16 trở lên)
- **Python** (v3.10 trở lên)
- **Ollama**: Tải và cài đặt tại [ollama.com](https://ollama.com/)
- *Khuyến nghị:* Để tốc độ stream của AI đạt tối đa, máy tính nên có GPU rời (VD: NVIDIA RTX 3070 Ti hoặc tương đương).

### 2. Khởi chạy Local AI (Ollama)
Mở terminal và tải model chuyên code (ví dụ sử dụng `qwen2.5-coder`):
```bash
ollama run qwen2.5-coder

### 3. Cài đặt Backend (FastAPI)
cd Backend
# Tạo môi trường ảo
python -m venv venv
# Kích hoạt môi trường (Windows)
venv\Scripts\activate
# Cài đặt thư viện
pip install fastapi uvicorn httpx gitpython pydantic
# Khởi chạy Server
uvicorn app.main:app --reload

### 4. Cài đặt Frontend (React/Vite)
cd Frontend
npm install
npm run dev