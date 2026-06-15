<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\App;

class UserResource extends JsonResource
{
    public static $wrap = null;

    private function notificationPreference()
    {
        $preferences = $this->notificationPreferences()->first();

        if (! $preferences) {
            return [
                'notifications' => false,
                'emailNotifications' => false,
                'pushNotifications' => false,
            ];
        }

        return [
            'notifications' => boolval(($preferences->in_app_enabled)),
            'emailNotifications' => boolval(($preferences->email_enabled)),
            'pushNotifications' => boolval(($preferences->push_enabled)),
        ];
    }

    /**
     * Transform the resource into an array.
     *
     * @return
     * array{
     *   id: int,
     *   username: string,
     *   birthday: string|null,
     *   firstConnected: string|null,
     *   name: string,
     *   email: string,
     *   firstName: string,
     *   lastName: string,
     *   phone: string,
     *   avatarURL: string,
     *   bio: string,
     *   website: string,
     *   language: string,
     *   offlineMode: string,
     *   stats: array,
     *   createdAt: string|null,
     *   updatedAt: string|null,
     *   notifications: bool,
     *   emailNotifications: bool,
     *   pushNotifications: bool
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'username' => $this->username ?? 'BikeAppUser:'.$this->id,
            // "address" => $this->address ?? "",
            // "location" => $this->location ?? "",
            'birthday' => $this->birthday ? $this->birthday->toDateString() : null,
            'firstConnected' => $this->first_connected ?? null,
            'name' => $this->name ?? '',
            'email' => $this->email ?? '',
            'firstName' => $this->first_name ?? 'first name',
            'lastName' => $this->last_name ?? 'last name',
            'phone' => $this->phone_number ?? '+0000000000',
            'avatarURL' => $this->picture ?? 'https://gravatar.com/avatar/'.md5(strtolower(trim($this->email))).'?d=identicon',
            'bio' => $this->bio ?? '',
            'website' => $this->website ?? '',
            'language' => $this->language ?? App::getLocale(),
            'offlineMode' => $this->offline_mode ?? '',
            'stats' => $this->stats,
            'createdAt' => $this->created_at ?? null,
            'updatedAt' => $this->updated_at ?? null,
            ...$this->notificationPreference(),
        ];
    }
}
