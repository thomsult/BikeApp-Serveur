<?php

namespace App\Models\Activity\Type;

use App\Enums\TypeActivityFamily;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class TypeActivity extends Model
{
    public bool $allows_public_viewing = true;

    protected $table = 'type_activities';

    protected $fillable = [
        'label',
        'family',
        'color',
        'user_id',
        'is_default',

    ];

    protected $casts = [
        'family' => TypeActivityFamily::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_default' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
