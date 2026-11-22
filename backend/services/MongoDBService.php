<?php
namespace App\Services;

use App\Config\Database;

class MongoDBService {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getDatabase();
    }

    public function getDatabase() {
        return $this->db;
    }

    public function getCollection($name) {
        if ($this->db) {
            return $this->db->selectCollection($name);
        }
        return null;
    }

    private function normalizeDoc($doc) {
        if (!$doc) return null;
        if (is_object($doc)) {
            $array = json_decode(json_encode($doc), true);
        } else {
            $array = (array)$doc;
        }
        if (isset($array['_id']) && is_array($array['_id']) && isset($array['_id']['$oid'])) {
            $array['_id'] = $array['_id']['$oid'];
        } elseif (isset($array['_id']) && is_object($array['_id'])) {
            $array['_id'] = (string)$array['_id'];
        }
        return $array;
    }

    public function find($collectionName, $filter = [], $options = []) {
        if (!$this->db) {
            throw new \RuntimeException("MongoDB Community Server is not connected. Ensure MongoDB is running.");
        }
        $collection = $this->db->selectCollection($collectionName);
        $cursor = $collection->find($filter, $options);
        $results = [];
        foreach ($cursor as $doc) {
            $results[] = $this->normalizeDoc($doc);
        }
        return $results;
    }

    public function findOne($collectionName, $filter = [], $options = []) {
        if (!$this->db) {
            throw new \RuntimeException("MongoDB Community Server is not connected. Ensure MongoDB is running.");
        }
        $collection = $this->db->selectCollection($collectionName);
        $doc = $collection->findOne($filter, $options);
        return $this->normalizeDoc($doc);
    }

    public function insertOne($collectionName, $document) {
        if (!$this->db) {
            throw new \RuntimeException("MongoDB Community Server is not connected. Ensure MongoDB is running.");
        }
        if (!isset($document['id'])) {
            $document['id'] = uniqid($collectionName . '_');
        }
        $now = date('c');
        if (!isset($document['created_at'])) {
            $document['created_at'] = $now;
        }
        $document['updated_at'] = $now;

        $collection = $this->db->selectCollection($collectionName);
        $res = $collection->insertOne($document);
        $document['_id'] = (string)$res->getInsertedId();
        return $document;
    }

    public function updateOne($collectionName, $filter, $update) {
        if (!$this->db) {
            throw new \RuntimeException("MongoDB Community Server is not connected. Ensure MongoDB is running.");
        }
        $collection = $this->db->selectCollection($collectionName);
        
        $updateData = $update;
        if (!isset($updateData['$set'])) {
            $update['updated_at'] = date('c');
            $updateData = ['$set' => $update];
        }

        $res = $collection->updateOne($filter, $updateData);
        return $res->getModifiedCount() > 0 || $res->getMatchedCount() > 0;
    }

    public function deleteOne($collectionName, $filter) {
        if (!$this->db) {
            throw new \RuntimeException("MongoDB Community Server is not connected. Ensure MongoDB is running.");
        }
        $collection = $this->db->selectCollection($collectionName);
        $res = $collection->deleteOne($filter);
        return $res->getDeletedCount() > 0;
    }

    public function count($collectionName, $filter = []) {
        if (!$this->db) {
            throw new \RuntimeException("MongoDB Community Server is not connected. Ensure MongoDB is running.");
        }
        $collection = $this->db->selectCollection($collectionName);
        return $collection->countDocuments($filter);
    }
}
