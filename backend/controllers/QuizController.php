<?php
namespace App\Controllers;

use App\Services\MongoDBService;
use App\Utils\Response;

class QuizController {
    private $mongo;

    public function __construct() {
        $this->mongo = new MongoDBService();
    }

    public function index() {
        $classId = $_GET['classId'] ?? null;
        $subjectCode = $_GET['subjectCode'] ?? null;

        $filter = [];
        if ($classId) $filter['classId'] = $classId;
        if ($subjectCode) $filter['subjectCode'] = $subjectCode;

        $quizzes = $this->mongo->find('quizzes', $filter);
        Response::success($quizzes);
    }

    public function show($id) {
        $quiz = $this->mongo->findOne('quizzes', ['id' => $id]);
        if (!$quiz) {
            Response::error('Quiz not found', 404);
        }
        Response::success($quiz);
    }

    public function submit($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $studentId = $input['studentId'] ?? '';
        $answers = $input['answers'] ?? [];

        $quiz = $this->mongo->findOne('quizzes', ['id' => $id]);
        if (!$quiz) {
            Response::error('Quiz not found', 404);
        }

        $questions = $quiz['questions'] ?? [];
        $correctCount = 0;
        foreach ($questions as $idx => $q) {
            if (isset($answers[$idx]) && $answers[$idx] == $q['correctAnswer']) {
                $correctCount++;
            }
        }

        $total = count($questions);
        $percentage = $total > 0 ? round(($correctCount / $total) * 100) : 0;
        $passed = $percentage >= ($quiz['passingScore'] ?? 70);

        $attempt = [
            'id' => uniqid('att_'),
            'studentId' => $studentId,
            'quizId' => $id,
            'quizTitle' => $quiz['title'],
            'score' => $correctCount,
            'total' => $total,
            'percentage' => $percentage,
            'passed' => $passed,
            'answers' => $answers,
            'attemptedAt' => date('Y-m-d H:i:s')
        ];

        $this->mongo->insertOne('quiz_attempts', $attempt);

        Response::success([
            'attempt' => $attempt,
            'correctCount' => $correctCount,
            'total' => $total,
            'percentage' => $percentage,
            'passed' => $passed
        ], 'Quiz evaluated successfully');
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['title']) || empty($input['classId']) || empty($input['subjectCode'])) {
            Response::error('Missing required fields for quiz', 400);
        }

        $quiz = $this->mongo->insertOne('quizzes', $input);
        Response::success($quiz, 'Quiz created successfully', 201);
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $updated = $this->mongo->updateOne('quizzes', ['id' => $id], $input);
        Response::success([], 'Quiz updated successfully');
    }

    public function destroy($id) {
        $this->mongo->deleteOne('quizzes', ['id' => $id]);
        Response::success([], 'Quiz deleted successfully');
    }
}
