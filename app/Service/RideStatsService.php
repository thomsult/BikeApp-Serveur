<?php

namespace App\Service;

use App\Models\User;

class RideStatsService
{
    public function getStats(User $user): array
    {
        $baseQuery = $user->rides()->whereNotNull('completed_at');

        $today = now()->toDateString();
        $weekStart = now()->startOfWeek()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();

        return [
            'todayStats' => $this->buildStats(
                (clone $baseQuery)->whereDate('completed_at', $today),
                withGoal: true,
                goal: $user->daily_goal ?? 0,
            ),
            'weeklyStats' => $this->buildStats(
                (clone $baseQuery)->whereDate('completed_at', '>=', $weekStart)
            ),
            'monthlyStats' => $this->buildStats(
                (clone $baseQuery)->whereDate('completed_at', '>=', $monthStart)
            ),
            'totalStats' => $this->buildStats($baseQuery),
        ];
    }

    private function buildStats($query, bool $withGoal = false, float $goal = 0): array
    {
        $result = $query->selectRaw('
            COUNT(*) as rides_count,
            COALESCE(SUM(distance), 0) as total_distance,
            COALESCE(SUM(duration), 0) as total_duration
        ')->first();

        return [
            'distance' => round(($result->total_distance ?? 0) / 1000, 2), // mètres → km
            'duration' => (int) ($result->total_duration ?? 0),             // secondes
            'rides' => (int) ($result->rides_count ?? 0),
            'goal' => $withGoal ? $goal : null,
        ];
    }
}
