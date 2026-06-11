<?php

namespace App\Models\Bikes;

use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperTypeBike
 */
class TypeBike extends Model
{
    protected $table = 'type_bikes';

    protected $fillable = [
        'label',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getLabelAttribute($value)
    {
        return __('bike_types.'.$value) !== 'bike_types.'.$value
        ? __('bike_types.'.$value)
        : $value;
    }
}
