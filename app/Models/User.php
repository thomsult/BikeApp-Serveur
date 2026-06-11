<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Activity\Activity;
use App\Models\Activity\Type\TypeActivity;
use App\Models\Bikes\Bike;
use App\Models\Bikes\Components\Components;
use App\Models\Notification\NotificationPreference;
use App\Models\Notification\PushToken;
use App\Service\RideStatsService;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;

/**
 * @mixin IdeHelperUser
 */
class User extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use Authorizable, HasFactory, Notifiable;

    protected $fillable = [
        'firebase_uid',
        'email',
        'username',
        'picture',
        'phone_number',
        'birthday',
        'first_connected',
        'offline_mode',
        'bio',
        'website',
        'language',
        'first_name',
        'last_name',
    ];

    protected $casts = [
        'birthday' => 'datetime',
        'first_connected' => 'datetime',
        'offline_mode' => 'boolean',
        'language' => 'string',
    ];

    protected $appends = ['stats'];

    public function typeActivities()
    {
        return $this->hasMany(TypeActivity::class);
    }

    public function bikes()
    {
        return $this->hasMany(Bike::class, 'user_id', 'id');
    }

    public function activities()
    {
        return $this->hasMany(Activity::class, 'user_id', 'id');
    }

    public function rides()
    {
        return $this->hasMany(Activity::class, 'user_id', 'id')
            ->whereHas('typeActivity', function ($query) {
                $query->where('family', 'ride');
            });
    }

    public function components()
    {
        return $this->hasMany(Components::class, 'user_id', 'id');
    }

    public function challenges()
    {
        return $this->hasMany(Challenge::class, 'user_id', 'id');
    }

    protected function stats(): Attribute
    {
        return Attribute::make(
            get: fn () => app(RideStatsService::class)->getStats($this)
        );
    }

    public function notificationPreferences()
    {
        return $this->hasOne(NotificationPreference::class);
    }

    public function pushTokens()
    {
        return $this->hasMany(PushToken::class);
    }

    public function routeNotificationForFcm()
    {
        return $this->pushTokens()->pluck('token')->toArray();
    }

    public function routeNotificationForMail()
    {

        return $this->email;
    }

    public function preferredLocale(): string
    {
        return $this->language ?? config('app.locale');
    }

    public function activitySnapshots()
    {
        return $this->hasMany(ActivitySnapshot::class, 'original_owner_id', 'id');
    }
}
