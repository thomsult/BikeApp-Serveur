<?php

namespace App\Models\Activity;

use App\Models\Bikes\Bike;
use App\Models\Bikes\Components\Components;

/**
 * @mixin IdeHelperActivityRide
 */
class ActivityRide extends Activity
{
    protected $fillable = [
        ...self::BASE_FILLABLE,
        'rideable_type',
        'rideable_id',
        'waypoints',
        'average_speed',
        'max_speed',
        'image_url',
        'distance',
        'duration',
    ];

    protected $casts = [
        ...self::BASE_CASTS,
        'waypoints' => 'array',
        'average_speed' => 'decimal:2',
        'max_speed' => 'decimal:2',
        'distance' => 'decimal:2',
    ];

    public function isBike(): bool
    {
        return $this->rideable_type === Bike::class;
    }

    public function isComponent(): bool
    {
        return $this->rideable_type === Components::class;
    }
}
