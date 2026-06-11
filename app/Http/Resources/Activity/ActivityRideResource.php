<?php

namespace App\Http\Resources\Activity;

use Illuminate\Http\Request;

class ActivityRideResource extends ActivityResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'distance' => $this->distance ?? 0,
            'duration' => $this->duration ?? 0,
            'avgSpeed' => $this->average_speed ?? 0,
            'maxSpeed' => $this->max_speed ?? 0,
            'waypoints' => $this->waypoints ?? [],
            'startedAt' => $this->started_at ?? '',
            'stoppedAt' => $this->stopped_at ?? '',

            ...$this->getRideable(),
        ];
    }
}
