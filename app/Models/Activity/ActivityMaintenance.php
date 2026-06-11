<?php

namespace App\Models\Activity;

use App\Models\Bikes\Bike;
use App\Models\Bikes\Components\Components;

class ActivityMaintenance extends Activity
{
    protected $fillable = [
        ...self::BASE_FILLABLE,
        'rideable_type',
        'rideable_id',
    ];

    protected $casts = self::BASE_CASTS;

    public function isBike(): bool
    {
        return $this->rideable_type === Bike::class;
    }

    public function isComponent(): bool
    {
        return $this->rideable_type === Components::class;
    }
}
