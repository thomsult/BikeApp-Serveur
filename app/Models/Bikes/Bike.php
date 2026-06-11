<?php

namespace App\Models\Bikes;

use App\Models\Activity\Activity;
use App\Models\Bikes\Components\Components;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Bike extends Model
{
    protected $table = 'bikes';

    protected $fillable = [
        'name',
        'type_bike_id',
        'user_id',
        'preferred',
        'status',
        'image_url',
    ];

    protected $casts = [
        'preferred' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'user_id',
        'type_bike_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function type()
    {
        return $this->belongsTo(TypeBike::class, 'type_bike_id');
    }

    public function stats()
    {
        return $this->hasOne(StatBike::class, 'bike_id');
    }

    public function components()
    {
        return $this->belongsToMany(Components::class, 'components_bikes', 'bike_id', 'component_id')->withTimestamps();
    }

    public function activities()
    {
        return $this->morphMany(Activity::class, 'rideable');
    }
}
