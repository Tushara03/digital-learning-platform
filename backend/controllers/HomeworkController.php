<?php
namespace App\Controllers;

use App\Services\MongoDBService;
use App\Utils\Response;

class HomeworkController {
    private $mongo;

    public function __construct() {
        $this->mongo = new MongoDBService();
    }

    public function index() {
        $classId = $_GET['classId'] ?? null;
        $filter = [];
        if ($classId) $filter['classId'] = $classId;

        $hw = $this->mongo->find('homework', $filter);
        Response::success($hw);
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['classId']) || empty($input['title']) || empty($input['instructions'])) {
            Response::error('Class, title, and instructions are required', 400);
        }

        $input['assignedDate'] = date('Y-m-d');
        $input['status'] = 'Assigned';
        $hw = $this->mongo->insertOne('homework', $input);
        Response::success($hw, 'Homework assigned to entire class', 201);
    }

    public function submit() {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['homeworkId']) || empty($input['studentId'])) {
            Response::error('Homework ID and student ID are required', 400);
        }

        $input['submittedAt'] = date('Y-m-d H:i:s');
        $input['status'] = 'Submitted';
        $sub = $this->mongo->insertOne('homework_submissions', $input);
        Response::success($sub, 'Homework submitted successfully', 201);
    }

    public function getSubmissions() {
        $homeworkId = $_GET['homeworkId'] ?? null;
        $studentId = $_GET['studentId'] ?? null;

        $filter = [];
        if ($homeworkId) $filter['homeworkId'] = $homeworkId;
        if ($studentId) $filter['studentId'] = $studentId;

        $subs = $this->mongo->find('homework_submissions', $filter);
        Response::success($subs);
    }

    public function grade($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $marks = $input['marks'] ?? 0;
        $feedback = $input['feedback'] ?? '';

        $this->mongo->updateOne('homework_submissions', ['id' => $id], [
            'marks' => $marks,
            'feedback' => $feedback,
            'status' => 'Reviewed',
            'gradedAt' => date('Y-m-d H:i:s')
        ]);

        Response::success([], 'Submission graded successfully');
    }
}
