<?php

namespace App\Models\Bikes\Components;

use App\Models\Activity\Activity;
use App\Models\Bikes\Bike;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperComponents
 */
class Components extends Model
{
    protected $table = 'components';

    protected $fillable = [
        'type_id',
        'brand_id',
        'model',
        'status',
        'multi_bike',
        'bike_id',
    ];

    public $hidden = [
        'type_id',
        'brand_id',
        'bike_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'multi_bike' => 'boolean',
    ];

    public function type()
    {
        return $this->belongsTo(ComponentsType::class, 'type_id');
    }

    public function brand()
    {
        return $this->belongsTo(ComponentsBrand::class, 'brand_id');
    }

    public function bikes()
    {
        return $this->belongsToMany(Bike::class, 'components_bikes', 'component_id', 'bike_id')->withTimestamps();
    }

    public function activities()
    {
        return $this->morphMany(Activity::class, 'rideable');
    }
}
