<?php

namespace App\Http\Resources;

use App\Enums\TypeActivityFamily;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TypeActivityResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        $family = match ($this->family) {
            'ride' => TypeActivityFamily::Ride,
            'maintenance' => TypeActivityFamily::Maintenance,
            'event' => TypeActivityFamily::Event,
            'challenge' => TypeActivityFamily::Challenge,
            'training' => TypeActivityFamily::Training,
            default => TypeActivityFamily::Other,
        };

        return [
            'id' => $this->id,
            'label' => $this->label,
            'family' => $family,
            'color' => $this->color,
            'userId' => $this->user_id,
            'isDefault' => boolval($this->is_default),
            'createdAt' => $this->created_at ?? null,
            'updatedAt' => $this->updated_at ?? null,
        ];
    }
}
