<?php

namespace App\Models\Bikes;

use Illuminate\Database\Eloquent\Model;

class ServiceBike extends Model
{
    protected $table = 'service_bikes';

    protected $fillable = [
        'method',
        'interval_distance',
        'interval_time',
        'interval_rides',
        'manual_note',
        'stat_bike_id',
    ];

    protected $casts = [
        'interval_distance' => 'float',
        'interval_time' => 'integer',
        'interval_rides' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'stat_bike_id',
    ];

    public function statBike()
    {
        return $this->belongsTo(StatBike::class);
    }
}
