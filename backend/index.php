<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/jwt.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/services/MongoDBService.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/QuizController.php';
require_once __DIR__ . '/controllers/HomeworkController.php';
require_once __DIR__ . '/controllers/StudentController.php';
require_once __DIR__ . '/config/grok.php';
require_once __DIR__ . '/services/GrokService.php';
require_once __DIR__ . '/controllers/TutorController.php';

use App\Config\Cors;
use App\Utils\Response;
use App\Controllers\AuthController;
use App\Controllers\QuizController;
use App\Controllers\HomeworkController;
use App\Controllers\StudentController;
use App\Controllers\TutorController;

Cors::handle();

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$action = $_GET['action'] ?? '';

// Health check endpoint
if (strpos($path, 'health') !== false || $action === 'health') {
    Response::success(['status' => 'online', 'timestamp' => time(), 'server' => 'PHP REST API + MongoDB']);
}

// Auth routes
if ($action === 'login' || strpos($path, 'auth/login') !== false) {
    $auth = new AuthController();
    $auth->login();
} elseif ($action === 'logout' || strpos($path, 'auth/logout') !== false) {
    $auth = new AuthController();
    $auth->logout();
} elseif ($action === 'me' || strpos($path, 'auth/me') !== false) {
    $auth = new AuthController();
    $auth->me();
}

// Students routes
if ($action === 'students' || strpos($path, 'students') !== false) {
    $studentCtrl = new StudentController();
    $sub = $_GET['sub'] ?? '';
    $id = $_GET['id'] ?? null;

    if ($method === 'GET') {
        if ($sub === 'stats') {
            $studentCtrl->stats();
        } else {
            $studentCtrl->index();
        }
    } elseif ($method === 'POST') {
        if ($sub === 'register') {
            $studentCtrl->register();
        }
    } elseif ($method === 'PUT') {
        if ($sub === 'toggle_status' && $id) {
            $studentCtrl->toggleStatus($id);
        } elseif ($sub === 'update_class' && $id) {
            $studentCtrl->updateClass($id);
        }
    }
}

// Quizzes and Units routes
if ($action === 'quizzes' || $action === 'units' || strpos($path, 'quizzes') !== false || strpos($path, 'units') !== false) {
    $quizCtrl = new QuizController();
    if ($method === 'GET') {
        $id = $_GET['id'] ?? null;
        if ($id) {
            $quizCtrl->show($id);
        } else {
            $quizCtrl->index();
        }
    } elseif ($method === 'POST') {
        $subAction = $_GET['sub'] ?? '';
        $id = $_GET['id'] ?? null;
        if ($subAction === 'submit' && $id) {
            $quizCtrl->submit($id);
        } else {
            $quizCtrl->store();
        }
    } elseif ($method === 'PUT') {
        $id = $_GET['id'] ?? null;
        $quizCtrl->update($id);
    } elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        $quizCtrl->destroy($id);
    }
}

// Homework routes
if ($action === 'homework' || strpos($path, 'homework') !== false) {
    $hwCtrl = new HomeworkController();
    if ($method === 'GET') {
        $sub = $_GET['sub'] ?? '';
        if ($sub === 'submissions') {
            $hwCtrl->getSubmissions();
        } else {
            $hwCtrl->index();
        }
    } elseif ($method === 'POST') {
        $sub = $_GET['sub'] ?? '';
        if ($sub === 'submit') {
            $hwCtrl->submit();
        } elseif ($sub === 'grade') {
            $id = $_GET['id'] ?? '';
            $hwCtrl->grade($id);
        } else {
            $hwCtrl->store();
        }
    }
}

// AI Tutor (Grok 4.7 API) routes
if ($action === 'tutor' || strpos($path, 'tutor') !== false) {
    $tutorCtrl = new TutorController();
    $tutorCtrl->chat();
}

// Fallback status
Response::success([
    'service' => 'Rural Digital Learning Platform API',
    'status' => 'operational',
    'routes' => [
        'POST /auth.php?action=login',
        'POST /tutor.php?action=tutor',
        'GET /students.php',
        'POST /students.php?sub=register',
        'GET /students.php?sub=stats',
        'PUT /students.php?sub=toggle_status&id={id}',
        'GET /quizzes.php',
        'POST /quizzes.php?sub=submit&id={quizId}',
        'GET /homework.php',
        'POST /homework.php?sub=submit',
        'POST /homework.php?sub=grade&id={submissionId}'
    ]
]);
