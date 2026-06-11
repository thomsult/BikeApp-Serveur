<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\UnauthorizedException;

class OwnsResource
{
    /**
     * Create a new policy instance.
     */
    public function __construct() {}

    public function viewAny(?User $user): ?bool
    {
        $user = $user ?? request()->user();

        return true;
    }

    public function create(?User $user): bool
    {
        $user = $user ?? request()->user();

        return true;
    }

    public function view(?User $user, Model $model): bool
    {
        $user = $user ?? request()->user();

        if (! $model->user_id && $model->allows_public_viewing) {
            return true; // Si le modèle n'a pas de user_id, tout le monde peut le voir
        }

        return $user?->id === $model->user_id ? true : throw new UnauthorizedException(__('validation.unauthorized'), 403);
    }

    public function update(?User $user, Model $model): bool
    {
        $user = $user ?? request()->user();

        return $user?->id === $model->user_id ? true : throw new UnauthorizedException(__('validation.unauthorized'), 403);
    }

    public function delete(?User $user, Model $model): bool
    {
        $user = $user ?? request()->user();

        return $user?->id === $model->user_id ? true : throw new UnauthorizedException(__('validation.unauthorized'), 403);
    }
}
