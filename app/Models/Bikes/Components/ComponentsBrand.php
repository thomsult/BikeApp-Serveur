<?php

namespace App\Models\Bikes\Components;

use Illuminate\Database\Eloquent\Model;

class ComponentsBrand extends Model
{
    protected $table = 'brand_components_bikes';

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
        return __('bike_components.brand.'.$value) !== 'bike_components.brand.'.$value
        ? __('bike_components.brand.'.$value)
        : $value;
    }
}
