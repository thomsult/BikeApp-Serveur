<?php

namespace App\Http\Resources\Activity;

use Illuminate\Http\Request;

class ActivityMaintenanceResource extends ActivityResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            ...$this->getRideable(),
            'startedAt' => $this->started_at ?? '',
            'stoppedAt' => $this->stopped_at ?? '',
        ];
    }
}
