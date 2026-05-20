import os
import git
from git.exc import InvalidGitRepositoryError

class GitService:
    def get_diff(self, repo_path: str) -> str:
        """
        Scan the folder project and take git diff(changed file don't commit yet)
        """
        
        if not os.path.exists(repo_path):
            raise ValueError(f"Đường dẫn không tồn tại: {repo_path}")
        
        try:
            repo = git.Repo(repo_path)
            diff_text = repo.git.diff('HEAD')
            if not diff_text:
                raise ValueError("Không tìm thấy thay đổi nào mới để review.")
            return diff_text
        except InvalidGitRepositoryError:
            raise ValueError(f"Thư mục này chưa được khởi tạo Git: {repo_path}")
        except Exception as e:
            raise ValueError(f"Lỗi khi đọc file Git: {str(e)}")