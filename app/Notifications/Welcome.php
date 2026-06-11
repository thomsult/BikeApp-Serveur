<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Kreait\Firebase\Messaging\AndroidConfig;
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;
use NotificationChannels\Fcm\Resources\Notification as FcmNotification;

class Welcome extends Notification
{
    use Queueable;

    public const TYPE = 'welcome';

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $preferences = $notifiable->notificationPreferences;

        return array_filter([
            $preferences?->email_enabled ? 'mail' : null,
            $preferences?->push_enabled ? FcmChannel::class : null,
            $preferences?->in_app_enabled ? 'database' : null,
        ]);
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Bienvenue sur BikeApp !')
            ->markdown('mail.welcome', ['user' => $notifiable, 'url' => route('redirect_app')]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Bienvenue sur BikeApp !',
            'message' => 'Voici quelques conseils pour bien démarrer :\n\n- Ajoutez votre vélo et ses composants pour suivre leur usure.\n- Enregistrez vos sorties pour analyser vos performances et suivre votre progression.\n- Participez à des défis pour rester motivé et vous amuser !',
        ];
    }

    public function toFcm($notifiable): FcmMessage
    {
        return new FcmMessage(
            notification: new FcmNotification(
                title: 'Bienvenue sur BikeApp !',
                body: "Voici quelques conseils pour bien démarrer :\n\n- Ajoutez votre vélo et ses composants pour suivre leur usure.\n- Enregistrez vos sorties pour analyser vos performances et suivre votre progression.\n- Participez à des défis pour rester motivé et vous amuser !",
            ),
            data: [
                'uri' => '(app)/calendar',
            ],
            custom: [
                'android' => AndroidConfig::fromArray([
                    'priority' => 'high',

                ]),
            ]
        );
    }
}
