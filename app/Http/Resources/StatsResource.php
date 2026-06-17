<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatsItemResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array{
     *   distance: float,
     *   duration: int,
     *   rides: int,
     *   goal: float|null
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'distance' => $this->distance ?? 0.0,
            'duration' => $this->duration ?? 0,
            'rides' => $this->rides ?? 0,
            'goal' => $this->goal ?? null,
        ];
    }
}

class StatsResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array{
     *   todayStats: array,
     *   weeklyStats: array,
     *   monthlyStats: array,
     *   totalStats: array
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'todayStats' => new StatsItemResource($this->todayStats),
            'weeklyStats' => new StatsItemResource($this->weeklyStats),
            'monthlyStats' => new StatsItemResource($this->monthlyStats),
            'totalStats' => new StatsItemResource($this->totalStats),
        ];
    }
}
