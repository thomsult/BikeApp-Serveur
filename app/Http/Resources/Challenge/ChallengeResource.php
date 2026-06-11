<?php

namespace App\Http\Resources\Challenge;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChallengeResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'challengeType' => $this->challenge_type,
            'challengeValue' => $this->challenge_value,
            'durationChallenge' => $this->duration_challenge,
            'isDailyGoal' => $this->is_daily_goal,
            'isSuggestion' => $this->is_suggestion,
            'completedAt' => $this->completed_at ?? '',
            'createdAt' => $this->created_at ?? '',
            'updatedAt' => $this->updated_at ?? '',
        ];
    }
}
