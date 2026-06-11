<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChallengeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'progress' => 'nullable|numeric|min:0',
            'challenge_type' => 'required|string|in:distance,time,speed',
            'challenge_value' => 'required|numeric',
            'duration_challenge' => 'required|integer',
            'is_daily_goal' => 'nullable|boolean',
            'is_suggestion' => 'nullable|boolean',
            'completed_at' => 'nullable|date|after:created_at',
        ];
    }

    public function prepareForValidation()
    {

        $this->merge([
            'challenge_type' => $this->input('challengeType'),
            'challenge_value' => $this->input('challengeValue'),
            'duration_challenge' => $this->input('durationChallenge'),
            'is_daily_goal' => $this->input('isDailyGoal', false),
            'is_suggestion' => $this->input('isSuggestion', false),
            'completed_at' => $this->input('completedAt'),
        ]);
    }
}
