<?php
namespace App\Config;

if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

class Database {
    private static $instance = null;
    private $client = null;
    private $database = null;

    private $host = '127.0.0.1';
    private $port = '27017';
    private $dbName = 'rural_learning_platform';

    private function __construct() {
        $uri = getenv('MONGODB_URI') ?: "mongodb://{$this->host}:{$this->port}";
        $dbName = getenv('MONGODB_DATABASE') ?: $this->dbName;
        $this->dbName = $dbName;

        if (class_exists('MongoDB\Client')) {
            try {
                $this->client = new \MongoDB\Client($uri);
                $this->database = $this->client->selectDatabase($this->dbName);
                
                // Ensure unique index on email for students
                $this->ensureIndexes();
            } catch (\Throwable $e) {
                error_log("MongoDB Connection Error: " . $e->getMessage());
            }
        }
    }

    private function ensureIndexes() {
        try {
            if ($this->database) {
                // Enforce unique email addresses through a MongoDB unique index
                $this->database->selectCollection('students')->createIndex(
                    ['email' => 1],
                    ['unique' => true, 'name' => 'unique_student_email']
                );
                $this->database->selectCollection('admins')->createIndex(
                    ['email' => 1],
                    ['unique' => true, 'name' => 'unique_admin_email']
                );
            }
        } catch (\Throwable $e) {
            // Index may already exist
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getDatabase() {
        return $this->database;
    }

    public function getClient() {
        return $this->client;
    }

    public function getDbName() {
        return $this->dbName;
    }
}
