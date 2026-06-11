<?php

namespace App\Models\Activity;

/**
 * @mixin IdeHelperActivityTraining
 */
class ActivityTraining extends Activity
{
    protected $fillable = [
        ...self::BASE_FILLABLE,
        'training_type',
        'duration',
    ];

    protected $casts = self::BASE_CASTS;
}
