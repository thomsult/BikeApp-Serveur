<?php

namespace App\Models\Bikes;

use App\Models\Bikes\Components\Components;
use Illuminate\Database\Eloquent\Model;

class ComponentsBike extends Model
{
    protected $table = 'components_bikes';

    protected $fillable = [
        'bike_id',
        'component_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function bike()
    {
        return $this->belongsTo(Bike::class, 'bike_id');
    }

    public function component()
    {
        return $this->belongsTo(Components::class, 'component_id');
    }
}
