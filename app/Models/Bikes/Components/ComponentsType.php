<?php

namespace App\Models\Bikes\Components;

use Illuminate\Database\Eloquent\Model;

class ComponentsType extends Model
{
    protected $table = 'type_components_bikes';

    protected $fillable = [
        'label',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function getLabelAttribute($value)
    {
        return __('bike_components.type.'.$value) !== 'bike_components.type.'.$value
        ? __('bike_components.type.'.$value)
        : $value;
    }
}
