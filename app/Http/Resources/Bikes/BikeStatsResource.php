<?php

namespace App\Http\Resources\Bikes;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BikeStatsResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stats = $this->resource;

        return [
            'id' => $stats->id,
            'distance' => $stats->distance,
            'rides' => $stats->rides,
            'lastService' => $stats->last_service_date,
            'service' => $this->whenLoaded('service') ? new BikeServiceResource($stats->service) : null,
            'createdAt' => $stats->created_at,
            'updatedAt' => $stats->updated_at,
        ];
    }
}
