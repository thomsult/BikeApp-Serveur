<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TypeActivityResource extends JsonResource
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
            'family' => $this->family,
            'color' => $this->color,
            'userId' => $this->user_id,
            'isDefault' => $this->is_default,
            'createdAt' => $this->created_at ?? '',
            'updatedAt' => $this->updated_at ?? '',
        ];
    }
}
