<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'email' => 'sometimes|email',
            'username' => 'sometimes|nullable|string|max:255',
            'first_name' => 'sometimes|nullable|string|max:255',
            'last_name' => 'sometimes|nullable|string|max:255',
            'picture' => 'sometimes|nullable|url',
            'phone_number' => 'sometimes|nullable|string|max:20',
            'birthday' => 'sometimes|nullable|date_format:Y-m-d',
            'bio' => 'sometimes|nullable|string|max:500',
            'website' => 'sometimes|nullable|url',
            'language' => 'sometimes|nullable|string|in:fr,en',
            'offline_mode' => 'sometimes|nullable|boolean',
            ...$this->notificationValidationRules(),
        ];
    }

    protected function prepareForValidation(): void
    {

        $data = [
            ...$this->notificationPrepareForValidation(),
        ];

        if ($this->has('phone')) {
            $data['phone_number'] = $this->input('phone');
        }

        if ($this->has('avatarURL')) {
            $data['picture'] = $this->input('avatarURL');
        }

        if ($this->has('offlineMode')) {
            $data['offline_mode'] = $this->input('offlineMode');
        }

        if ($this->has('firstName')) {
            $data['first_name'] = $this->input('firstName');
        }

        if ($this->has('lastName')) {
            $data['last_name'] = $this->input('lastName');
        }
        if ($this->has('language')) {
            $data['language'] = $this->input('language', 'fr');
        }

        $this->merge($data);
    }

    private function notificationValidationRules(): array
    {
        return [
            'notificationsPreferences' => 'sometimes|array',
            'notificationsPreferences.in_app_enabled' => 'sometimes|boolean',
            'notificationsPreferences.email_enabled' => 'sometimes|boolean',
            'notificationsPreferences.push_enabled' => 'sometimes|boolean',
        ];
    }

    private function notificationPrepareForValidation(): array
    {
        $data = [];

        if ($this->has('notifications')) {
            $data['notificationsPreferences.in_app_enabled'] = $this->input('notifications');
        }

        if ($this->has('emailNotifications')) {
            $data['notificationsPreferences.email_enabled'] = $this->input('emailNotifications');
        }

        if ($this->has('pushNotifications')) {
            $data['notificationsPreferences.push_enabled'] = $this->input('pushNotifications');
        }

        return $data;
    }
}
