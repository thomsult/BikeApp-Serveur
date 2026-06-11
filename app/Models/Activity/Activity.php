<?php

namespace App\Models\Activity;

use App\Models\Activity\Type\TypeActivity;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperActivity
 */
class Activity extends Model
{
    protected $table = 'activities';

    public bool $allows_public_viewing = false;

    public const BASE_FILLABLE = [
        'title',
        'description',
        'user_id',
        'type_id',
        'recurrence_frequency',
        'recurrence_interval',
        'dt_start',
        'dt_end',
        'location',
        'notes',
        'completed_at',
        'started_at',
        'stopped_at',
        'version',
    ];

    public const BASE_CASTS = [
        'dt_start' => 'datetime',
        'dt_end' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'stopped_at' => 'datetime',
        'started_at' => 'datetime',
        'version' => 'integer',

    ];

    protected $hidden = [
        'user_id',
        'type_id',
        'version',
    ];

    protected $fillable = [
        ...self::BASE_FILLABLE,
    ];

    protected $casts = [
        ...self::BASE_CASTS,
    ];

    // Map type -> classe
    protected static array $morphMap = [
        'ride' => ActivityRide::class,
        'training' => ActivityTraining::class,
        'maintenance' => ActivityMaintenance::class,
        'event' => ActivityEvent::class,
        'other' => ActivityOther::class,
    ];

    public function scopeWithFamily(Builder $query): Builder
    {
        return $query
            ->select('activities.*', 'type_activities.family as type_family')
            ->leftJoin('type_activities', 'type_activities.id', '=', 'activities.type_id');
    }

    public function resolveRouteBinding($value, $field = null): ?static
    {
        return $this->withFamily()->where('activities.id', $value)->first();
    }

    public function newFromBuilder($attributes = [], $connection = null): static
    {
        $attributes = (array) $attributes;
        $family = $attributes['type_family'] ?? null;

        $class = isset($family)
            ? (static::$morphMap[strtolower($family)] ?? static::class)
            : static::class;

        $model = (new $class)->newInstance([], true);
        $model->setRawAttributes($attributes, true);
        $model->setConnection($connection ?: $this->getConnectionName());

        return $model;
    }

    public function typeActivity()
    {
        return $this->hasOne(TypeActivity::class, 'id', 'type_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function family(): ?string
    {
        return $this->typeActivity->family->value ?? null;
    }

    public function rideable()
    {
        return $this->morphTo(); // Bike ou Component
    }
}
