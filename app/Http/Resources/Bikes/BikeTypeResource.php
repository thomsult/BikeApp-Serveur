<?php

namespace App\Http\Resources\Bikes;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BikeTypeResource extends JsonResource
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
            'label' => $this->label,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
