<?php

namespace App\Http\Resources\Notifications;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {

        return [
            'id' => $this->id,
            'suggestionType' => $this->type::TYPE ?? 'social',
            'title' => $this->data['title'] ?? null,
            'subtitle' => $this->data['message'] ?? null,
            'link' => $this->data['link'] ?? null,
            'readAt' => $this->read_at ?? null,
            'createdAt' => $this->created_at ?? null,
            'updatedAt' => $this->updated_at ?? null,
        ];

    }
}
