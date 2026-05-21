import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FolderGit2, Send, AlertTriangle } from 'lucide-react';
import { useAIStream } from '../hooks/useAIStream';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function GitReview() {
    const [repoPath, setRepoPath] = useState('C:\\Users\\bao\\Downloads\\Work\\AI_Review_Code');
    const [language, setLanguage] = useState('python');

    const { reviewText, isLoading, error, startReview } = useAIStream();

    const handleReview = () => {
        if (repoPath) startReview(repoPath, language, '');
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex gap-4 items-end">
                <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                        <FolderGit2 size={16} /> Git Repository Path (Local)
                    </label>
                    <input
                        type="text"
                        value={repoPath}
                        onChange={(e) => setRepoPath(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
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
                    </select>
                </div>

                <button
                    onClick={handleReview}
                    disabled={isLoading || !repoPath}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all disabled:bg-gray-700 disabled:text-gray-500"
                >
                    <Send size={18} /> {isLoading ? 'Đang phân tích...' : 'Review Code'}
                </button>
            </div>

            {/* Hiển thị lỗi */}
            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg flex items-center gap-3">
                    <AlertTriangle size={20} /> <p>{error}</p>
                </div>
            )}

            {/* Khung hiển thị Markdown */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 min-h-[400px] shadow-lg">
                <ReactMarkdown
                    components={{
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-blue-400 mt-8 mb-4 border-b border-gray-700 pb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-white mt-6 mb-3" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4" {...props} />,
                        li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
                        code: ({ node, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match && !className;

                            if (isInline) return <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;

                            return (
                                <div className="my-6 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                                    <div className="bg-gray-950 px-4 py-1.5 text-xs font-mono text-gray-400 flex justify-between items-center border-b border-gray-800">
                                        <span>{match ? match[1].toUpperCase() : 'CODE'}</span>
                                    </div>
                                    <SyntaxHighlighter language={match ? match[1] : 'text'} style={vscDarkPlus} PreTag="div" customStyle={{ margin: 0, background: '#090d16', padding: '1.25rem', fontSize: '0.875rem' }} {...props}>
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            );
                        }
                    }}
                >
                    {reviewText}
                </ReactMarkdown>
            </div>
        </div>
    );
}