<?php
namespace App\Services;

use App\Config\GrokConfig;

class GrokService {
    private $apiKey;
    private $model;
    private $endpoint;
    private $timeout;

    public function __construct() {
        $this->apiKey = GrokConfig::getApiKey();
        $this->model = GrokConfig::getModel();
        $this->endpoint = GrokConfig::getEndpoint();
        $this->timeout = GrokConfig::getTimeout();
    }

    /**
     * Send chat request to official xAI Grok API
     */
    public function askTutor($userMessage, $history = [], $context = []) {
        $classId = $context['classId'] ?? 'c5';
        $className = $context['className'] ?? 'Class 5';
        $classStd = $context['classStd'] ?? '5th STD';
        $subjectCode = $context['subjectCode'] ?? 'mathematics';
        $subjectName = $context['subjectName'] ?? 'Mathematics';
        $unitTitle = $context['unitTitle'] ?? '';
        $preferredLang = $context['preferredLanguage'] ?? 'en';

        // Build pedagogical system prompt tailored to student's exact grade and subject
        $systemPrompt = $this->buildSystemPrompt($className, $classStd, $subjectCode, $subjectName, $unitTitle, $preferredLang);

        // Format conversation history for xAI
        $formattedMessages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];

        // Append recent multi-turn conversation history (limit to last 8 turns)
        if (is_array($history) && !empty($history)) {
            $recentHistory = array_slice($history, -8);
            foreach ($recentHistory as $item) {
                $role = ($item['role'] ?? 'user') === 'assistant' ? 'assistant' : 'user';
                $content = trim($item['content'] ?? '');
                if (!empty($content)) {
                    $formattedMessages[] = [
                        'role' => $role,
                        'content' => $content
                    ];
                }
            }
        }

        // Append latest user message
        $formattedMessages[] = [
            'role' => 'user',
            'content' => $userMessage
        ];

        // If no API key configured, return friendly guidance message
        if (empty($this->apiKey)) {
            return [
                'success' => true,
                'message' => $this->getFallbackTeacherResponse($userMessage, $className, $subjectCode, $subjectName, $unitTitle, $preferredLang),
                'model' => 'grok-4.7 (offline-ready teacher mode)',
                'note' => 'To connect directly with live xAI Grok servers, configure your GROK_API_KEY in backend/.env'
            ];
        }

        // Call xAI Responses API (with fallback to Chat Completions if required by gateway)
        return $this->callXaiApi($formattedMessages);
    }

    private function callXaiApi($messages) {
        // Attempt 1: Official xAI Responses API endpoint (https://api.x.ai/v1/responses)
        $payloadResponses = [
            'model' => $this->model,
            'input' => $messages,
            'temperature' => 0.4,
            'max_output_tokens' => 1200
        ];

        $ch = curl_init($this->endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payloadResponses));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->apiKey,
            'User-Agent: RuralDigitalLearningPlatform/2.0'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            return [
                'success' => false,
                'message' => 'Network connectivity timeout connecting to xAI Grok. Please check internet connection.',
                'error_type' => 'network_timeout'
            ];
        }

        // If 404 or unsupported route on /responses, try standard /chat/completions endpoint
        if ($httpCode === 404 || $httpCode === 400) {
            return $this->callChatCompletionsFallback($messages);
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            $data = json_decode($response, true);
            $extractedText = $this->extractOutputText($data);
            if (!empty($extractedText)) {
                return [
                    'success' => true,
                    'message' => $extractedText,
                    'model' => $data['model'] ?? $this->model,
                    'endpoint' => 'https://api.x.ai/v1/responses'
                ];
            }
        }

        // If authorization fails or rate limit
        if ($httpCode === 401 || $httpCode === 403) {
            return [
                'success' => false,
                'message' => 'xAI API authorization failed. Please verify your Grok API key in backend/.env.',
                'error_type' => 'auth_failed'
            ];
        } elseif ($httpCode === 429) {
            return [
                'success' => false,
                'message' => 'Grok API rate limit reached. Please wait a moment before asking another question.',
                'error_type' => 'rate_limited'
            ];
        }

        // Fallback attempt to chat completions endpoint
        return $this->callChatCompletionsFallback($messages);
    }

    private function callChatCompletionsFallback($messages) {
        $chatUrl = 'https://api.x.ai/v1/chat/completions';
        $payloadChat = [
            'model' => $this->model,
            'messages' => $messages,
            'temperature' => 0.4,
            'max_tokens' => 1200
        ];

        $ch = curl_init($chatUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payloadChat));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->apiKey,
            'User-Agent: RuralDigitalLearningPlatform/2.0'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            $data = json_decode($response, true);
            $extractedText = $this->extractOutputText($data);
            if (!empty($extractedText)) {
                return [
                    'success' => true,
                    'message' => $extractedText,
                    'model' => $data['model'] ?? $this->model,
                    'endpoint' => $chatUrl
                ];
            }
        }

        return [
            'success' => false,
            'message' => 'The AI Tutor is temporarily unable to reach Grok API servers. Please try again in a few moments.',
            'error_type' => 'api_error'
        ];
    }

    private function extractOutputText($data) {
        if (!is_array($data)) return null;

        // Responses API output formats
        if (!empty($data['output_text'])) {
            return trim($data['output_text']);
        }
        if (!empty($data['output']) && is_array($data['output'])) {
            foreach ($data['output'] as $out) {
                if (isset($out['content'])) {
                    if (is_string($out['content'])) return trim($out['content']);
                    if (is_array($out['content'])) {
                        foreach ($out['content'] as $c) {
                            if (isset($c['text'])) return trim($c['text']);
                        }
                    }
                }
            }
        }

        // Chat completions format
        if (!empty($data['choices'][0]['message']['content'])) {
            return trim($data['choices'][0]['message']['content']);
        }

        if (!empty($data['response'])) {
            return trim($data['response']);
        }

        return null;
    }

    private function buildSystemPrompt($className, $classStd, $subjectCode, $subjectName, $unitTitle, $preferredLang) {
        $prompt = "You are 'Guru', a warm, encouraging, highly skilled rural school teacher and AI Tutor powered by Grok 4.7 for students in {$className} ({$classStd}) studying in rural India.\n\n";

        $prompt .= "CURRENT STUDENT CONTEXT:\n";
        $prompt .= "- Academic Class: {$className} ({$classStd})\n";
        $prompt .= "- Current Subject: {$subjectName} (code: {$subjectCode})\n";
        if (!empty($unitTitle)) {
            $prompt .= "- Active Unit: {$unitTitle}\n";
        }
        $prompt .= "- Preferred Interface Language: {$preferredLang}\n\n";

        $prompt .= "STRICT PEDAGOGICAL & LANGUAGE RULES:\n";
        $prompt .= "1. LANGUAGE MATCHING:\n";
        $prompt .= "   - If the subject is 'Kannada' (ಕನ್ನಡ): You MUST respond in pure, authentic Kannada script (ಕನ್ನಡ ಲಿಪಿ). Never use English transliteration for Kannada. Use rich, warm Kannada suitable for a school student.\n";
        $prompt .= "   - If the subject is 'Hindi' (हिन्दी): You MUST respond in pure Devanagari Hindi script (देवनागरी लिपि). Never use Hinglish. Use natural, clear Hindi suitable for a school student.\n";
        $prompt .= "   - If the subject is 'English': Respond in simple, clear, grammatically pristine English.\n";
        $prompt .= "   - For other subjects (Mathematics, EVS, Biology, Computer Science, GK): Explain primarily in the student's preferred language ({$preferredLang}) or English, and switch language if the student speaks in Kannada or Hindi.\n\n";

        $prompt .= "2. AGE-APPROPRIATE EXPLANATIONS:\n";
        if (strpos($className, '1') !== false || strpos($className, '2') !== false) {
            $prompt .= "   - FOR CLASS 1 & 2: Use very simple, short sentences. Use playful, friendly comparisons with toys, fruits, mangoes, birds, and farm animals. Be extra enthusiastic and supportive!\n";
        } elseif (strpos($className, '3') !== false || strpos($className, '4') !== false || strpos($className, '5') !== false) {
            $prompt .= "   - FOR CLASS 3 TO 5: Explain concepts clearly step-by-step. Use familiar rural examples (village markets, farming, rainfall, local trees). Build intuition before formulas.\n";
        } else {
            $prompt .= "   - FOR CLASS 6 & 7: Provide clear analytical explanations, show step-by-step mathematical working, and encourage scientific inquiry and critical thinking.\n";
        }

        $prompt .= "\n3. TEACHER DISPOSITION:\n";
        $prompt .= "- When a student asks about a quiz question or test, DO NOT just give the direct answer! Provide a helpful hint or guide them step-by-step so they discover the answer themselves.\n";
        $prompt .= "- When explaining mathematics, break calculations into numbered steps.\n";
        $prompt .= "- Use bullet points and clean formatting to make explanations easy to read.\n";
        $prompt .= "- End your response with a short encouraging remark or an invitation to try a small practice question.\n";

        return $prompt;
    }

    private function getFallbackTeacherResponse($question, $className, $subjectCode, $subjectName, $unitTitle, $lang) {
        if ($subjectCode === 'kannada') {
            return "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕನ್ನಡ ಶಿಕ್ಷಕ (Grok AI Tutor). {$className} ತರಗತಿಯ ಕನ್ನಡ ವಿಷಯದ ಕುರಿತು ನೀವು ಕೇಳಿರುವ ಪ್ರಶ್ನೆ: \"{$question}\".\n\nಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ವ್ಯಾಕರಣದಲ್ಲಿ ಇದು ಬಹುಮುಖ್ಯವಾದ ಪರಿಕಲ್ಪನೆ. ಪಠ್ಯದ ಪ್ರಮುಖ ಅಂಶಗಳನ್ನು ಗಮನಿಸಿ: ಕನ್ನಡದಲ್ಲಿ ಅಕ್ಷರಗಳು, ಪದರಚನೆ ಮತ್ತು ಅರ್ಥವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಿರಂತರ ಓದುವಿಕೆ ಅತ್ಯಗತ್ಯ.\n\nನೀವು ಈ ಕುರಿತು ಇನ್ನಷ್ಟು ಉದಾಹರಣೆಗಳನ್ನು ನೋಡಲು ಬಯಸುವಿರಾ? ನನ್ನನ್ನು ಯಾವುದೇ ಸಂದೇಹವಿದ್ದರೂ ಕೇಳಿ!";
        } elseif ($subjectCode === 'hindi') {
            return "नमस्ते! मैं आपका हिन्दी शिक्षक (Grok AI Tutor) हूँ। {$className} के हिन्दी विषय से जुड़ा आपका प्रश्न है: \"{$question}\".\n\nहिन्दी भाषा और व्याकरण में यह एक अत्यंत महत्वपूर्ण बिंदु है। शब्दों के सही अर्थ, वर्तनी और वाक्यों में उनके प्रयोग को समझकर अभ्यास करना चाहिए।\n\nक्या आप इस पर कोई सरल उदाहरण या अभ्यास प्रश्न हल करना चाहेंगे? बेझिझक पूछिए!";
        } else {
            return "Hello! I am your friendly AI Tutor powered by Grok for {$className} ({$subjectName}).\n\nRegarding your question: \"{$question}\":\n\nIn {$subjectName}, understanding the core concept step-by-step is key! For {$className} students, remember that practical examples from everyday life make learning fun and lasting.\n\nWould you like me to guide you with a step-by-step hint or give you a quick practice question to test your knowledge?";
        }
    }
}
