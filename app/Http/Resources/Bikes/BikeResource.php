<?php

namespace App\Http\Resources\Bikes;

use App\Http\Resources\Bikes\Components\ComponentsResource;
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
            'preferred' => boolval($this->preferred),
            'status' => intval($this->status),
            'image' => $this->image_url,
            'type' => $this->whenLoaded('type') ? new BikeTypeResource($this->type) : null,
            'stats' => $this->whenLoaded('stats') ? new BikeStatsResource($this->stats) : null,
            'components' => $this->whenLoaded('components') ? ComponentsResource::collection($this->components) : null,
            'createdAt' => $this->created_at ?? null,
            'updatedAt' => $this->updated_at ?? null,
        ];
    }
}
