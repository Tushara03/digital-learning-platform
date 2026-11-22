<?php
require_once __DIR__ . '/vendor/autoload.php';

try {
    $client = new \MongoDB\Client('mongodb://127.0.0.1:27017');
    $dbs = iterator_to_array($client->listDatabaseNames());
    echo "CONNECTED TO MONGODB SUCCESSFULLY via Composer MongoDB\\Client!\n";
    echo "Available databases: " . implode(', ', $dbs) . "\n";
} catch (\Throwable $e) {
    echo "Connection error: " . $e->getMessage() . "\n";
}
