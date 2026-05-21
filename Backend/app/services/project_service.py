import os 
from collections import Counter
from typing import Tuple

class ProjectService:
    def __init__(self):
        # Bộ lọc né các thư mục rác, môi trường ảo để không bị tràn RAM
        self.ignored_dirs = {
            '.git', 'node_modules', 'venv', '.venv', 'env', '__pycache__', 
            'dist', 'build', '.next', '.idea', '.vscode', 'obj', 'bin'
        }
        self.ignored_files = {
            'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 
            'poetry.lock', 'Cargo.lock', '.DS_Store'
        }
        # Từ điển ánh xạ đuôi file sang ngôn ngữ
        self.extension_map = {
            '.py': 'Python',
            '.js': 'JavaScript', '.jsx': 'React JavaScript',
            '.ts': 'TypeScript', '.tsx': 'React TypeScript',
            '.java': 'Java (Spring Boot)',
            '.cs': 'C# (.NET)'
        }
    
    def analyze_project(self, project_path: str) -> Tuple[str, str]:
        if not os.path.exists(project_path):
            raise ValueError(f"Đường dẫn '{project_path}' không tồn tại.")
        
        detected_extensions = []
        project_contents = []
        
        for root, dirs, files in os.walk(project_path):
            dirs[:] = [d for d in dirs if d not in self.ignored_dirs and not d.startswith('.')]
            
            for file in files:
                if file in self.ignored_files:
                    continue
                
                file_path = os.path.join(root, file)
                _, ext = os.path.splitext(file)
                ext = ext.lower()
                
                if ext in self.extension_map:
                    detected_extensions.append(ext)
                    if os.path.getsize(file_path) < 50000:
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                relative_path = os.path.relpath(file_path, project_path)
                                project_contents.append(f"--- FILE: {relative_path} ---")
                                project_contents.append(f.read())
                                project_contents.append("\n")
                        except Exception:
                            continue
                        
        if not detected_extensions:
            raise ValueError("Không tìm thấy file mã nguồn hợp lệ (Python, JS, TS, Java, C#) trong thư mục này.")
        
        most_common_ext = Counter(detected_extensions).most_common(1)[0][0]
        language_name = self.extension_map[most_common_ext]
        
        full_code_snapshot = "\n".join(project_contents)
        
        return language_name, full_code_snapshot