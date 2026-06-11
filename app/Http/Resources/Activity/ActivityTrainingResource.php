<?php

namespace App\Http\Resources\Activity;

use Illuminate\Http\Request;

class ActivityTrainingResource extends ActivityResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'trainingType' => $this->training_type,
            'duration' => $this->duration,
        ];
    }
}
