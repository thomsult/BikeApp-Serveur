<?php

namespace App\Models\Bikes;

use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperStatBike
 */
class StatBike extends Model
{
    protected $table = 'stat_bikes';

    protected $fillable = [
        'bike_id',
        'distance',
        'rides',
        'last_service_date',
    ];

    protected $hidden = [
        'bike_id',
    ];

    protected $casts = [
        'distance' => 'float',
        'rides' => 'integer',
        'last_service_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function bike()
    {
        return $this->belongsTo(Bike::class);
    }

    public function service()
    {
        return $this->hasOne(ServiceBike::class);
    }
}
