import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Bot, GitBranch, FolderGit2, FileCode2 } from 'lucide-react';

export default function MainLayout() {
    const location = useLocation(); // Lấy đường dẫn hiện tại để bôi màu nút đang chọn

    // Hàm kiểm tra xem nút nào đang được active
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center">
            {/* Thanh Điều Hướng (Navbar) */}
            <nav className="w-full bg-gray-950 border-b border-gray-800 p-4 sticky top-0 z-10 shadow-lg">
                <div className="max-w-6xl mx-auto flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <Bot size={32} className="text-blue-400" />
                        <h1 className="text-2xl font-bold text-white">AI Architecture</h1>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to="/git"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/git') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                        >
                            <GitBranch size={18} /> Quét Git Diff
                        </Link>

                        <Link
                            to="/project"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/project') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                        >
                            <FolderGit2 size={18} /> Cấu trúc Dự án
                        </Link>

                        <Link
                            to="/manual"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/manual') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                        >
                            <FileCode2 size={18} /> Dán Code
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Nội dung thay đổi của từng trang sẽ được nhúng vào đây */}
            <main className="w-full max-w-6xl p-8">
                <Outlet />
            </main>
        </div>
    );
}