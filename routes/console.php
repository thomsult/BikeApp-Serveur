<?php

use App\Models\User;
use App\Notifications\Welcome;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use NotificationChannels\Fcm\FcmChannel;

require __DIR__.'/mail.php';

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('notifie', function () {
    User::all()->each(function (User $user) {
        $user->notifyNow(new Welcome, [FcmChannel::class]);
    });
})->purpose('Envoie une notification de bienvenue à tous les utilisateurs');
