<?php

namespace App\Models\Stats;

// NOT BDD model, just a class to hold the stats for a user

class StatsUser
{
    public StatsItems $todayStats;

    public StatsItems $weeklyStats;

    public StatsItems $monthlyStats;

    public StatsItems $totalStats;

    public function __construct(StatsItems $todayStats, StatsItems $weeklyStats, StatsItems $monthlyStats, StatsItems $totalStats)
    {
        $this->todayStats = $todayStats;
        $this->weeklyStats = $weeklyStats;
        $this->monthlyStats = $monthlyStats;
        $this->totalStats = $totalStats;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            todayStats: StatsItems::fromArray($data['todayStats'] ?? []),
            weeklyStats: StatsItems::fromArray($data['weeklyStats'] ?? []),
            monthlyStats: StatsItems::fromArray($data['monthlyStats'] ?? []),
            totalStats: StatsItems::fromArray($data['totalStats'] ?? []),
        );
    }
}
