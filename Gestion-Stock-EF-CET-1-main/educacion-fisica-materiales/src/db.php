<?php
// db.php - conexión SQLite local

class Database {
    private $db_path;
    public $conn;

    public function __construct() {
        $this->db_path = __DIR__ . '/../sql/materiales.sqlite';
    }

    private function initializeSchema(PDO $pdo) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS materiales (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            name TEXT NOT NULL,\n            description TEXT,\n            created_at TEXT DEFAULT CURRENT_TIMESTAMP\n        );");
    }

    public function connect() {
        $this->conn = null;

        try {
            $this->conn = new PDO('sqlite:' . $this->db_path);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->initializeSchema($this->conn);
        } catch (PDOException $exception) {
            echo 'Connection error: ' . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>