<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TypeActivityResource extends JsonResource
{
    public static $wrap = null;

    /**
     * @return array{
     *   id: int,
     *   label: string,
     *   family: string,
     *   color: string,
     *   userId: int,
     *   isDefault: bool,
     *   createdAt: string|null,
     *   updatedAt: string|null
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'family' => $this->family,
            'color' => $this->color,
            'userId' => $this->user_id,
            'isDefault' => boolval($this->is_default),
            'createdAt' => $this->created_at ?? null,
            'updatedAt' => $this->updated_at ?? null,
        ];
    }
}
