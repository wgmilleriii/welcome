CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_text TEXT NOT NULL,
    middle_text TEXT NOT NULL,
    end_text TEXT NOT NULL,
    attribution VARCHAR(255) NOT NULL,
    mountain_id VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    share_token VARCHAR(32) UNIQUE NOT NULL,
    likes INT DEFAULT 0,
    views INT DEFAULT 0
); 