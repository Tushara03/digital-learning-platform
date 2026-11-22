<?php
namespace App\Config;

class GrokConfig {
    public static function getApiKey() {
        // 1. Check environment variables
        $key = getenv('GROK_API_KEY') ?: (getenv('XAI_API_KEY') ?: ($_ENV['GROK_API_KEY'] ?? ($_ENV['XAI_API_KEY'] ?? null)));
        if (!empty($key)) {
            return trim($key);
        }

        // 2. Check backend/.env file
        $envFile = dirname(__DIR__) . '/.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || $line[0] === '#') continue;
                if (strpos($line, '=') !== false) {
                    list($k, $v) = explode('=', $line, 2);
                    $k = trim($k);
                    $v = trim($v, " \t\n\r\0\x0B\"'");
                    if ($k === 'GROK_API_KEY' || $k === 'XAI_API_KEY') {
                        return $v;
                    }
                }
            }
        }

        // 3. Check server config file if present
        $cfgFile = __DIR__ . '/grok_secret.json';
        if (file_exists($cfgFile)) {
            $json = json_decode(file_get_contents($cfgFile), true);
            if (!empty($json['api_key'])) {
                return trim($json['api_key']);
            }
        }

        return '';
    }

    public static function getEndpoint() {
        return 'https://api.x.ai/v1/responses';
    }

    public static function getModel() {
        return 'grok-4.7';
    }

    public static function getTimeout() {
        return 30; // seconds
    }
}
