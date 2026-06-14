<?php

namespace App\Http\Resources\Bikes\Components;

use App\Models\Bikes\Components\ComponentsBrand;
use App\Models\Bikes\Components\ComponentsType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComponentsResource extends JsonResource
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
            'model' => $this->model,
            'status' => intval($this->status),
            'multiBike' => $this->multi_bike,
            'type' => $this->whenLoaded('type') ? $this->typeComponents($this->type) : null,
            'brand' => $this->whenLoaded('brand') ? $this->brandComponents($this->brand) : null,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }

    private function typeComponents(?ComponentsType $type): ?array
    {
        if (is_null($type)) {
            return null;
        }

        return [
            'id' => $type->id,
            'label' => $type->label,
        ];
    }

    private function brandComponents(?ComponentsBrand $brand): ?array
    {
        if (is_null($brand)) {
            return null;
        }

        return [
            'id' => $brand->id,
            'label' => $brand->label,
        ];
    }
}
