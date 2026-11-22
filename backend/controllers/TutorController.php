<?php
namespace App\Controllers;

use App\Services\GrokService;
use App\Utils\Response;

class TutorController {
    private $grokService;

    public function __construct() {
        $this->grokService = new GrokService();
    }

    public function chat() {
        // Only allow POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed. Use POST.', 405);
        }

        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);

        if (!$data || empty($data['message'])) {
            Response::error('Message content is required.', 400);
        }

        $message = trim($data['message']);

        // Input validation & sanitization
        if (mb_strlen($message) > 1500) {
            Response::error('Message is too long. Please ask questions under 1500 characters.', 400);
        }

        // Sanitize string (strip tags, keep unicode intact)
        $cleanMessage = strip_tags($message);

        $history = isset($data['history']) && is_array($data['history']) ? $data['history'] : [];
        $context = isset($data['studentContext']) && is_array($data['studentContext']) ? $data['studentContext'] : [];

        // Basic rate limiting check using session / IP / storage if needed
        $clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        $result = $this->grokService->askTutor($cleanMessage, $history, $context);

        if ($result['success']) {
            Response::success([
                'reply' => $result['message'],
                'model' => $result['model'] ?? 'grok-4.7',
                'context' => [
                    'class' => $context['className'] ?? 'Class 5',
                    'subject' => $context['subjectName'] ?? 'Mathematics',
                ],
                'note' => $result['note'] ?? null
            ]);
        } else {
            Response::error($result['message'] ?? 'AI Tutor could not generate a response.', 500);
        }
    }
}
