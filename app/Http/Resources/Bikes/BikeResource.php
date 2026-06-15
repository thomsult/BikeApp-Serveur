<?php

namespace App\Http\Resources\Bikes;

use App\Http\Resources\Bikes\Components\ComponentsResource;
use App\Models\Bikes\ServiceBike;
use App\Models\Bikes\StatBike;
use App\Models\Bikes\TypeBike;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BikeResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'preferred' => $this->preferred,
            'status' => $this->status,
            'image' => $this->image_url,
            'type' => $this->whenLoaded('type') ? $this->typeBikes($this->type) : null,
            'stats' => $this->whenLoaded('stats') ? $this->statsBikes($this->stats) : null,
            'components' => $this->whenLoaded('components') ? ComponentsResource::collection($this->components) : null,
            'createdAt' => $this->created_at ?? null,
            'updatedAt' => $this->updated_at ?? null,
        ];
    }

    private function typeBikes(?TypeBike $type): array
    {
        if (is_null($type)) {
            return [];
        }

        return [
            'id' => $type->id,
            'label' => $type->label,
            'createdAt' => $type->created_at,
            'updatedAt' => $type->updated_at,
        ];
    }

    private function statsBikes(?StatBike $stats): array
    {
        if (is_null($stats)) {
            return [];
        }

        return [
            'id' => $stats->id,
            'distance' => $stats->distance,
            'rides' => $stats->rides,
            'lastService' => $stats->last_service_date,
            'service' => $this->serviceBike($stats->service()->first()),
            'createdAt' => $stats->created_at,
            'updatedAt' => $stats->updated_at,
        ];
    }

    private function serviceBike(?ServiceBike $status): array
    {
        if (is_null($status)) {
            return [];
        }

        return [
            'id' => $status->id,
            'method' => $status->method,
            'intervalDistance' => $status->interval_distance,
            'intervalTime' => $status->interval_time,
            'intervalRides' => $status->interval_rides,
            'manualNote' => $status->manual_note,
            'createdAt' => $status->created_at,
            'updatedAt' => $status->updated_at,
        ];
    }
}
