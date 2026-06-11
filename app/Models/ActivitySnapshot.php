<?php

namespace App\Models;

use App\Models\Activity\Activity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @mixin IdeHelperActivitySnapshot
 */
class ActivitySnapshot extends Model
{
    protected $fillable = [
        'token',
        'original_id',
        'original_owner_id',
        'original_version',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
        'original_version' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'original_owner_id');
    }

    public static function generateUniqueToken(): string
    {
        do {
            $token = Str::random(12);
        } while (self::where('token', $token)->exists());

        return $token;
    }

    public static function generateSnapshotData(Activity $activity): array
    {
        return [
            ...$activity->only([
                'title',
                'description',
                'recurrence_frequency',
                'recurrence_interval',
                'location',
                'notes',
                'distance',
                'duration',
                'waypoints',
            ]),
            'type_family' => $activity->family(),
        ];
    }
}
