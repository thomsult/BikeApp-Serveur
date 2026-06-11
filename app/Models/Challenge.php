<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'challenge_type',
        'challenge_value',
        'duration_challenge',
        'is_daily_goal',
        'is_suggestion',
        'completed_at',
    ];

    protected $casts = [
        'is_daily_goal' => 'boolean',
        'is_suggestion' => 'boolean',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function challengesTypeAttribue()
    {
        return match ($this->challenge_type) {
            'distance' => 'distance',
            'time' => 'time',
            'speed' => 'speed',
            default => null,
        };
    }

    public function createDefaultChallengesForUser(User $user)
    {
        $defaultChallenges = [
            [
                'title' => '5 km Challenge',
                'description' => '',
                'challenge_type' => 'distance',
                'challenge_value' => 5,
                'duration_challenge' => 1,
                'is_daily_goal' => true,
                'is_suggestion' => false,
            ],
        ];

        foreach ($defaultChallenges as $challengeData) {
            $user->challenges()->create($challengeData);
        }
    }
}
