<?php

namespace App\Http\Controllers;

use App\Http\Resources\Notifications\NotificationResource;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $notifications = request()->user()->notifications()->get();

        return response()->json(NotificationResource::collection($notifications));
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, DatabaseNotification $notification)
    {
        if (! $notification) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(NotificationResource::make($notification));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DatabaseNotification $notification)
    {
        if (! $notification) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $notification->markAsRead();
        $notification->refresh();

        return response()->json(NotificationResource::make($notification));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, DatabaseNotification $notification)
    {
        if (! $notification) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $notification->delete();

        return response()->json(null, 204);
    }
}
