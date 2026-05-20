import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, FolderGit2, AlertTriangle } from 'lucide-react';
import { useAIStream } from './hooks/useAIStream';

function App() {
  // Thay đổi path mặc định thành thư mục chứa repo hiện tại của bạn
  const [repoPath, setRepoPath] = useState('C:\\Users\\bao\\Downloads\\Work\\AI_Review_Code');
  const [language, setLanguage] = useState('python');

  // Gọi "động cơ" Streaming đã viết ở bước trước
  const { reviewText, isLoading, error, startReview } = useAIStream();

  const handleReview = () => {
    if (!repoPath) return;
    startReview(repoPath, language);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-5xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bot size={36} className="text-blue-400" />
          <h1 className="text-3xl font-bold text-white">AI Code Reviewer</h1>
        </div>

        {/* Khung Nhập Liệu */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8 flex gap-4 items-end shadow-lg">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
              <FolderGit2 size={16} /> Git Repository Path (Local)
            </label>
            <input
              type="text"
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              className="w-full bg-gray-950 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Nhập đường dẫn tới thư mục dự án..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">Ngôn ngữ</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-950 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript / TS</option>
              <option value="java">Java (Spring)</option>
              <option value="csharp">C# (.NET)</option>
            </select>
          </div>

          <button
            onClick={handleReview}
            disabled={isLoading || !repoPath}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${isLoading || !repoPath
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
              }`}
          >
            <Send size={18} />
            {isLoading ? 'Đang phân tích...' : 'Review Code'}
          </button>
        </div>

        {/* Khung Báo Lỗi */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg mb-8 flex items-center gap-3 animate-fade-in">
            <AlertTriangle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Khung Hiển Thị Kết Quả Review */}
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 min-h-[400px] shadow-lg">
          {!reviewText && !isLoading && !error && (
            <div className="text-gray-500 flex flex-col justify-center items-center h-full gap-3 mt-20">
              <Bot size={48} className="opacity-20" />
              <p>Chưa có dữ liệu review. Hãy nhập đường dẫn và bấm nút để bắt đầu.</p>
            </div>
          )}

          <div className="text-gray-200">
            {/* Custom cấu hình Markdown để UI đẹp mắt trong Tailwind */}
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-blue-400 mt-8 mb-4 border-b border-gray-700 pb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-white mt-6 mb-3" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4" {...props} />,
                li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
                code: ({ node, className, children, ...props }) => {
                  // Phân biệt inline code (code ngắn) và block code (code dài)
                  const match = /language-(\w+)/.exec(className || '');
                  return !match && !className ? (
                    <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-sm mb-6 border border-gray-700 font-mono text-green-400">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </div>
                  );
                }
              }}
            >
              {reviewText}
            </ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;