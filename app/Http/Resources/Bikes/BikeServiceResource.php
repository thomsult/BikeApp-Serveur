<?php

namespace App\Http\Resources\Bikes;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BikeServiceResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $service = $this->resource;

        return [
            'id' => $service->id,
            'method' => $service->method,
            'intervalDistance' => $service->interval_distance,
            'intervalTime' => $service->interval_time,
            'intervalRides' => $service->interval_rides,
            'manualNote' => $service->manual_note,
            'createdAt' => $service->created_at,
            'updatedAt' => $service->updated_at,
        ];
    }
}
