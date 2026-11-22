<?php
namespace App\Controllers;

use App\Services\MongoDBService;
use App\Utils\Response;

class StudentController {
    private $mongo;
    private $auth;

    public function __construct() {
        $this->mongo = new MongoDBService();
        $this->auth = new AuthController();
    }

    // Role check helper: Ensures only Admin can access administrative endpoints
    private function requireAdmin() {
        $user = $this->auth->getAuthenticatedUser();
        if (!$user || ($user['role'] ?? '') !== 'admin') {
            Response::error('Access denied. Administrator privileges required.', 403);
            exit;
        }
        return $user;
    }

    // List all registered students (Admin Only - without password hashes)
    public function index() {
        $this->requireAdmin();

        $classId = $_GET['classId'] ?? null;
        $search = $_GET['search'] ?? null;

        $filter = [];
        if ($classId && $classId !== 'all') {
            $filter['classId'] = $classId;
        }

        $students = $this->mongo->find('students', $filter);

        if ($search) {
            $searchLower = strtolower($search);
            $students = array_values(array_filter($students, function($s) use ($searchLower) {
                return (isset($s['name']) && strpos(strtolower($s['name']), $searchLower) !== false) ||
                       (isset($s['email']) && strpos(strtolower($s['email']), $searchLower) !== false);
            }));
        }

        // Remove sensitive fields
        foreach ($students as &$s) {
            unset($s['passwordHash']);
            unset($s['password_hash']);
        }

        Response::success($students);
    }

    // Get registration stats (Admin Only)
    public function stats() {
        $this->requireAdmin();

        $students = $this->mongo->find('students', []);
        $total = count($students);

        $classCounts = [
            'c1' => 0, 'c2' => 0, 'c3' => 0, 'c4' => 0,
            'c5' => 0, 'c6' => 0, 'c7' => 0, 'unassigned' => 0
        ];

        $activeCount = 0;
        $disabledCount = 0;

        foreach ($students as $s) {
            $cId = $s['classId'] ?? null;
            if ($cId && isset($classCounts[$cId])) {
                $classCounts[$cId]++;
            } else {
                $classCounts['unassigned']++;
            }

            $status = $s['status'] ?? 'active';
            if ($status === 'disabled') {
                $disabledCount++;
            } else {
                $activeCount++;
            }
        }

        Response::success([
            'totalRegistered' => $total,
            'activeCount' => $activeCount,
            'disabledCount' => $disabledCount,
            'classCounts' => $classCounts
        ]);
    }

    // Register a new student (Public Registration - enforces unique email, password hashing, class selection)
    public function register() {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $name = trim($input['name'] ?? '');
        $email = strtolower(trim($input['email'] ?? ''));
        $password = $input['password'] ?? '';
        $confirmPassword = $input['confirmPassword'] ?? $input['confirm_password'] ?? '';
        $classId = trim($input['classId'] ?? '');
        $className = trim($input['className'] ?? '');
        $classStd = trim($input['classStd'] ?? '');

        // Validation
        if (empty($name)) {
            Response::error('Full name is required', 400);
            return;
        }

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('A valid email address is required', 400);
            return;
        }

        if (empty($password)) {
            Response::error('Password is required', 400);
            return;
        }

        if (strlen($password) < 6) {
            Response::error('Password must be at least 6 characters long', 400);
            return;
        }

        if (empty($confirmPassword)) {
            Response::error('Please confirm your password', 400);
            return;
        }

        if ($password !== $confirmPassword) {
            Response::error('Password and confirm password do not match', 400);
            return;
        }

        // Validate Class selection from Class 1 to Class 7
        $validClasses = [
            'c1' => ['name' => 'Class 1', 'std' => '1st STD'],
            'c2' => ['name' => 'Class 2', 'std' => '2nd STD'],
            'c3' => ['name' => 'Class 3', 'std' => '3rd STD'],
            'c4' => ['name' => 'Class 4', 'std' => '4th STD'],
            'c5' => ['name' => 'Class 5', 'std' => '5th STD'],
            'c6' => ['name' => 'Class 6', 'std' => '6th STD'],
            'c7' => ['name' => 'Class 7', 'std' => '7th STD'],
        ];

        if (empty($classId) || !isset($validClasses[$classId])) {
            Response::error('Please select a valid class between Class 1 and Class 7', 400);
            return;
        }

        if (empty($className)) {
            $className = $validClasses[$classId]['name'];
        }
        if (empty($classStd)) {
            $classStd = $validClasses[$classId]['std'];
        }

        // Check for existing duplicate student by email
        $existing = $this->mongo->findOne('students', ['email' => $email]);
        if ($existing) {
            Response::error('A student account with this email address already exists. Please log in.', 409);
            return;
        }

        // Also check admins collection to prevent duplicate email conflicts
        $existingAdmin = $this->mongo->findOne('admins', ['email' => $email]);
        if ($existingAdmin) {
            Response::error('This email address is already associated with an existing account.', 409);
            return;
        }

        // Secure password hashing using PHP password_hash()
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $studentId = uniqid('s_');
        $newStudent = [
            'id' => $studentId,
            'studentId' => $studentId,
            'name' => $name,
            'email' => $email,
            'emailOrUsername' => $email,
            'passwordHash' => $hashedPassword,
            'role' => 'student', // Strictly enforce student role; public cannot register as admin
            'classId' => $classId,
            'selectedClass' => $classId,
            'className' => $className,
            'classStd' => $classStd,
            'status' => 'active',
            'joinedDate' => date('Y-m-d'),
            'avatar' => $input['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        ];

        try {
            $saved = $this->mongo->insertOne('students', $newStudent);
        } catch (\Throwable $e) {
            // Handle MongoDB unique index violation code (E11000 duplicate key error)
            if (strpos($e->getMessage(), 'E11000') !== false || $e->getCode() === 11000) {
                Response::error('A student account with this email address already exists (unique index constraint).', 409);
                return;
            }
            Response::error('Database error during student registration: ' . $e->getMessage(), 500);
            return;
        }

        unset($newStudent['passwordHash']);
        unset($newStudent['password_hash']);

        Response::success($newStudent, 'Student registration successful! You can now log in.', 201);
    }

    // Toggle active / disabled status (Admin Only)
    public function toggleStatus($studentId) {
        $this->requireAdmin();

        $student = $this->mongo->findOne('students', ['id' => $studentId]);
        if (!$student) {
            Response::error('Student not found', 404);
            return;
        }

        $currentStatus = $student['status'] ?? 'active';
        $newStatus = ($currentStatus === 'active') ? 'disabled' : 'active';

        $this->mongo->updateOne('students', ['id' => $studentId], ['status' => $newStatus]);

        Response::success(['id' => $studentId, 'status' => $newStatus], "Student account has been {$newStatus}");
    }

    // Update class assignment
    public function updateClass($studentId) {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $classId = $input['classId'] ?? null;
        $className = $input['className'] ?? null;
        $classStd = $input['classStd'] ?? null;

        $validClasses = [
            'c1' => ['name' => 'Class 1', 'std' => '1st STD'],
            'c2' => ['name' => 'Class 2', 'std' => '2nd STD'],
            'c3' => ['name' => 'Class 3', 'std' => '3rd STD'],
            'c4' => ['name' => 'Class 4', 'std' => '4th STD'],
            'c5' => ['name' => 'Class 5', 'std' => '5th STD'],
            'c6' => ['name' => 'Class 6', 'std' => '6th STD'],
            'c7' => ['name' => 'Class 7', 'std' => '7th STD'],
        ];

        if ($classId && isset($validClasses[$classId])) {
            $className = $className ?: $validClasses[$classId]['name'];
            $classStd = $classStd ?: $validClasses[$classId]['std'];
        }

        $this->mongo->updateOne('students', ['id' => $studentId], [
            'classId' => $classId,
            'selectedClass' => $classId,
            'className' => $className,
            'classStd' => $classStd
        ]);

        Response::success([
            'classId' => $classId,
            'className' => $className,
            'classStd' => $classStd
        ], 'Class updated successfully');
    }
}
