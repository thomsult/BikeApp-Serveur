<?php

namespace App\Service;

class DeepLinksHelper
{
    public static function appBaseLink(): string
    {
        return config('app.mobile_url', 'app://');
    }

    public static function createDeepLink(array $data): string
    {
        $type = $data['type'];
        unset($data['type']);

        return config('app.mobile_url', 'app://').'(app)/'.$type.'?'.http_build_query($data);
    }

    public static function generateShareUrl(string $type, string $shareLink): string
    {
        return self::createDeepLink(['type' => strtolower($type), 'share_link' => $shareLink]);
    }
}
