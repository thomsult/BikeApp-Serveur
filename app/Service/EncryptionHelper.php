<?php

namespace App\Service;

class EncryptionHelper
{
    private static string $cipher = 'aes-256-gcm';

    private static int $ivLength = 12; // 12 bytes recommandé pour GCM

    private static function getKey(): string
    {
        $key = config('app.key');

        if (! $key) {
            throw new \RuntimeException('Encryption key not set.');
        }

        return hash('sha256', $key, true);
    }

    public static function encrypt(string $data): string
    {
        $key = self::getKey();
        $iv = random_bytes(self::$ivLength);
        $tag = '';

        $encrypted = openssl_encrypt(
            $data,
            self::$cipher,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        return base64_encode($iv.$tag.$encrypted);
    }

    public static function decrypt(string $encryptedData): ?string
    {
        $key = self::getKey();
        $decoded = base64_decode($encryptedData, true);

        if ($decoded === false) {
            return null;
        }

        $iv = substr($decoded, 0, self::$ivLength);
        $tag = substr($decoded, self::$ivLength, 16);
        $ciphertext = substr($decoded, self::$ivLength + 16);

        return openssl_decrypt(
            $ciphertext,
            self::$cipher,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );
    }
}
