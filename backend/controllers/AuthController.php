<?php
namespace App\Controllers;

use App\Services\MongoDBService;
use App\Utils\Response;

class AuthController {
    private $mongo;
    private $secretKey;

    public function __construct() {
        $this->mongo = new MongoDBService();
        $this->secretKey = getenv('JWT_SECRET') ?: 'karnataka_rural_learning_secret_token_key_2026';
    }

    // Student & Admin login verifying against MongoDB Community Server
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $email = strtolower(trim($input['email'] ?? ''));
        $password = $input['password'] ?? '';
        $role = trim($input['role'] ?? 'student');

        if (empty($email) || empty($password)) {
            Response::error('Email and password are required', 400);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Please enter a valid email address', 400);
            return;
        }

        if ($role === 'admin') {
            // Admin authentication from MongoDB 'admins' collection
            $user = $this->mongo->findOne('admins', ['email' => $email]);
            if (!$user) {
                Response::error('Invalid administrator credentials', 401);
                return;
            }

            $hash = $user['passwordHash'] ?? $user['password_hash'] ?? '';
            if (empty($hash) || !password_verify($password, $hash)) {
                Response::error('Invalid administrator credentials', 401);
                return;
            }

            $userRole = 'admin';
        } else {
            // Student authentication from MongoDB 'students' collection
            $user = $this->mongo->findOne('students', ['email' => $email]);
            if (!$user) {
                Response::error('Invalid student email or password. Please check your credentials or register.', 401);
                return;
            }

            // Check if student account is deactivated
            if (isset($user['status']) && $user['status'] === 'disabled') {
                Response::error('Your student account has been deactivated by the administrator. Please contact your school.', 403);
                return;
            }

            $hash = $user['passwordHash'] ?? $user['password_hash'] ?? '';
            if (empty($hash) || !password_verify($password, $hash)) {
                Response::error('Invalid student email or password', 401);
                return;
            }

            $userRole = 'student';
        }

        // Remove password hashes from response
        unset($user['passwordHash']);
        unset($user['password_hash']);

        // Generate secure server-side session token
        $issuedAt = time();
        $expiresAt = $issuedAt + (86400 * 7); // 7-day session
        $payload = [
            'id' => $user['id'] ?? $user['studentId'] ?? $user['adminId'],
            'email' => $user['email'],
            'role' => $userRole,
            'iat' => $issuedAt,
            'exp' => $expiresAt
        ];

        $tokenPayloadEncoded = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
        $signature = hash_hmac('sha256', $tokenPayloadEncoded, $this->secretKey);
        $sessionToken = "{$tokenPayloadEncoded}.{$signature}";

        // Save active session in MongoDB sessions collection
        try {
            $this->mongo->insertOne('sessions', [
                'userId' => $payload['id'],
                'email' => $payload['email'],
                'role' => $userRole,
                'token' => $sessionToken,
                'expiresAt' => date('c', $expiresAt),
                'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
            ]);
        } catch (\Throwable $e) {
            // non-fatal
        }

        Response::success([
            'user' => $user,
            'token' => $sessionToken,
            'role' => $userRole,
            'restoredClass' => [
                'classId' => $user['classId'] ?? null,
                'className' => $user['className'] ?? null,
                'classStd' => $user['classStd'] ?? null
            ]
        ], 'Login successful');
    }

    // Secure logout - invalidates session
    public function logout() {
        $token = $this->getBearerToken();
        if ($token) {
            try {
                $this->mongo->deleteOne('sessions', ['token' => $token]);
            } catch (\Throwable $e) {
                // non-fatal
            }
        }
        Response::success([], 'Logged out successfully');
    }

    // Verify session
    public function me() {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            Response::error('Unauthorized or session expired', 401);
            return;
        }

        unset($user['passwordHash']);
        unset($user['password_hash']);
        Response::success(['user' => $user]);
    }

    // Helper: extract Bearer token from header
    private function getBearerToken() {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
        return $_GET['token'] ?? null;
    }

    // Helper: validate token and return user
    public function getAuthenticatedUser() {
        $token = $this->getBearerToken();
        if (!$token) return null;

        $parts = explode('.', $token);
        if (count($parts) !== 2) return null;

        list($payloadEncoded, $signature) = $parts;
        $expectedSig = hash_hmac('sha256', $payloadEncoded, $this->secretKey);
        if (!hash_equals($expectedSig, $signature)) {
            return null;
        }

        $payload = json_decode(base64_decode(strtr($payloadEncoded, '-_', '+/')), true);
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        $collection = ($payload['role'] === 'admin') ? 'admins' : 'students';
        return $this->mongo->findOne($collection, ['id' => $payload['id']]);
    }
}
