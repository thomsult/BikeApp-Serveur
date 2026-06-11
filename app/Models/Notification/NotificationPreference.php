<?php

namespace App\Models\Notification;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class NotificationPreference extends Model
{
    protected $table = 'notification_preferences';

    protected $fillable = [
        'user_id',
        'in_app_enabled',
        'email_enabled',
        'push_enabled',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
