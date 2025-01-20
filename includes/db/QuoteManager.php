<?php
class QuoteManager {
    private $pdo;
    
    public function __construct() {
        try {
            $this->pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS
            );
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            error_log("Connection failed: " . $e->getMessage());
        }
    }
    
    public function saveQuote($data) {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO quotes 
                (start_text, middle_text, end_text, attribution, mountain_id, created_at, share_token)
                VALUES (?, ?, ?, ?, ?, NOW(), ?)
            ");
            
            $shareToken = $this->generateShareToken();
            
            return $stmt->execute([
                $data['start'],
                $data['middle'],
                $data['end'],
                $data['attribution'],
                $data['mountainId'],
                $shareToken
            ]);
        } catch(PDOException $e) {
            error_log("Save failed: " . $e->getMessage());
            return false;
        }
    }
    
    private function generateShareToken() {
        return bin2hex(random_bytes(16));
    }
}
?> 