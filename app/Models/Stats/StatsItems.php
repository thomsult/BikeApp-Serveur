<?php

namespace App\Models\Stats;

// NOT BDD model, just a class to hold the stats for a user

class StatsItems
{
    public float $distance;

    public int $duration;

    public int $rides;

    public ?float $goal;

    public function __construct(float $distance, int $duration, int $rides, ?float $goal = null)
    {
        $this->distance = $distance;
        $this->duration = $duration;
        $this->rides = $rides;
        $this->goal = $goal;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            distance: $data['distance'] ?? 0.0,
            duration: $data['duration'] ?? 0,
            rides: $data['rides'] ?? 0,
            goal: $data['goal'] ?? null,
        );
    }
}
