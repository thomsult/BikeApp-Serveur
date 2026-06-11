<?php

namespace App\Service;

use App\Models\User;
use App\Notifications\Welcome;

class BikeAppService
{
    public static function onboarding(User $user)
    {
        if ($user->first_connected === null) {
            $user->update(['first_connected' => now()]);
            $user->challenges()->create([
                'user_id' => $user->id,
                'title' => 'dayly challenges',
                'description' => '',
                'challenge_type' => 'distance',
                'challenge_value' => 5,
                'duration_challenge' => 1,
                'is_daily_goal' => true,
                'is_suggestion' => false,
                'completed_at' => null,
            ]);
            $user->notificationPreferences()->create([
                'user_id' => $user->id,
                'in_app_enabled' => true,
                'email_enabled' => true,
                'push_enabled' => true,
            ]);
            $user->typeActivities()->create([
                'label' => 'Default',
                'family' => 'other',
                'color' => '#000000',
                'user_id' => $user->id,
                'is_default' => true,
            ]);
            $user->notifyNow(new Welcome);

        }
    }

    public static function subscribeToNotifications(User $user, array $tokenWithPlatform)
    {
        if (! $tokenWithPlatform['token'] || ! $tokenWithPlatform['platform']) {
            $user->notificationPreferences()->update([
                'push_enabled' => false,
            ]);

            return;
        }
        $user->pushTokens()->updateOrCreate(
            ['token' => $tokenWithPlatform['token']],
            ['platform' => $tokenWithPlatform['platform']]
        );
    }

    public static function offboarding(User $user)
    {
        $user->bikes()->delete();
        $user->delete();
    }
}
