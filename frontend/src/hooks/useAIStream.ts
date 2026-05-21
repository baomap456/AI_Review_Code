import { useState } from 'react';

// Định nghĩa Custom Hook để xử lý luồng Streaming
export const useAIStream = () => {
    const [reviewText, setReviewText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const startReview = async (repoPath: string, language: string, rawCode: string) => {
        // 1. Reset lại toàn bộ state (trạng thái) trước khi bắt đầu
        setIsLoading(true);
        setReviewText('');
        setError(null);

        try {
            // 2. Gửi lệnh POST sang FastAPI ở cổng 8000
            const response = await fetch('http://127.0.0.1:8000/api/review/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repo_path: repoPath, language, raw_code: rawCode }),
            });

            // Bắt lỗi nếu Backend báo file không tồn tại hoặc lỗi Git
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Lỗi kết nối từ server Backend.');
            }

            // 3. Khởi tạo đối tượng Reader để "hứng" chữ streaming
            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');

            if (!reader) throw new Error('Trình duyệt của bạn không hỗ trợ stream.');

            // 4. Vòng lặp liên tục đọc từng đoạn chữ cho đến khi AI (Ollama) báo xong
            while (true) {
                const { done, value } = await reader.read();

                if (done) break; // AI đã sinh xong chữ, thoát vòng lặp

                // Dịch cục byte thành chuỗi text
                const chunk = decoder.decode(value, { stream: true });

                // Cập nhật lên state của React (Cộng dồn chữ mới vào đuôi chữ cũ)
                setReviewText((prev) => prev + chunk);
            }
        } catch (err: any) {
            setError(err.message); // Hiển thị lỗi lên UI nếu có sự cố
        } finally {
            setIsLoading(false); // Tắt trạng thái loading (Nhả nút bấm ra)
        }
    };

    // Trả về các biến và hàm để App.tsx có thể sử dụng
    return { reviewText, isLoading, error, startReview };
};