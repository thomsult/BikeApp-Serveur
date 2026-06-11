<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Service\BikeAppService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function loginForm()
    {
        return response()->json([
            'message' => 'Please use POST method to login.',
        ], 405);
    }

    // /**
    //  * Display a listing of the resource.
    //  */
    public function index(Request $request)
    {

        $user = $request->user();

        return UserResource::make($user);
    }

    public function show(User $user)
    {
        $this->authorizeForUser(request()->user(), 'view', $user);

        return UserResource::make($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {

        $this->authorizeForUser(request()->user(), 'update', $user);

        $user = $request->user();

        $data = $request->validated();
        $user->update($data);

        $user->notificationPreferences()->update($data['notificationsPreferences']);
        $user->refresh();

        return UserResource::make($user);
    }

    public function login(Request $request)
    {
        $user = $request->user();

        BikeAppService::onboarding($user);
        $tokenWithPlatform = [
            'token' => $request->header('X-Push-Token'),
            'platform' => $request->header('X-Platform'),
        ];
        BikeAppService::subscribeToNotifications($user, $tokenWithPlatform);

        return response()->json([
            'message' => 'Login successful',
            'user' => UserResource::make($user),
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $removeUser = $request->validate([
            'removeUser' => 'boolean',
        ])['removeUser'] ?? false;

        if ($removeUser) {
            BikeAppService::offboarding($user);

            return response()->json([
                'message' => 'User removed successfully',
            ]);

        }

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }

    public function forgetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if (! $user) {
            return response()->json([
                'message' => __('auth.forget_password.user_not_found'),
            ], 404);
        }
        Firebase::auth()->sendPasswordResetLink($user->email);

        return response()->json([
            'message' => __('auth.forget_password.link_sent'),
        ]);
    }

    public function resetPassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user->password = bcrypt($request->input('new_password'));
        $user->save();

        return response()->json([
            'message' => __('auth.forget_password.reset_successful'),
        ]);
    }
}
