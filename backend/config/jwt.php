<?php
namespace App\Config;

class JWTConfig {
    public static $secret = 'rural_learn_jwt_secure_key_2026_super_secret';
    public static $issuer = 'rural_learning_platform';
    public static $expiration = 86400 * 7; // 7 days
}
