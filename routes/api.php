<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivityTypeController;
use App\Http\Controllers\BikeController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\ComponentsBikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use App\Models\Bikes\Components\ComponentsBrand;
use App\Models\Bikes\Components\ComponentsType;
use App\Models\Bikes\TypeBike;
use Illuminate\Support\Facades\Route;

Route::apiResource('profile', UserController::class)->parameters(['profile' => 'user']);

Route::apiResource('activities/types', ActivityTypeController::class)
    ->parameters(['types' => 'typeActivity']);

Route::apiResource('activities', ActivityController::class)
    ->parameters(['activities' => 'activity']);

Route::get('bikes/types', function () {
    return response()->json(TypeBike::all());
});
Route::get('bikes/types/{typeBike}', function ($typeBike) {
    return response()->json(TypeBike::findOrFail($typeBike));
});

Route::get('bikes/components/brands', function () {
    return response()->json(ComponentsBrand::all());
});
Route::get('bikes/components/brands/{brand}', function ($brand) {
    return response()->json(ComponentsBrand::findOrFail($brand));
});

Route::get('bikes/components/types', function () {
    return response()->json(ComponentsType::all());
});
Route::get('bikes/components/types/{type}', function ($type) {
    return response()->json(ComponentsType::findOrFail($type));
});

Route::apiResource('bikes/components', ComponentsBikeController::class)
    ->parameters(['components' => 'component']);

Route::apiResource('bikes', BikeController::class)
    ->parameters(['bikes' => 'bike']);

Route::post('/upload', [UploadController::class, 'upload']);
Route::get('/upload/{user}/{path}/{filename}', [UploadController::class, 'download']);

Route::apiResource('challenges', ChallengeController::class)
    ->parameters(['challenges' => 'challenge']);

Route::apiResource('notifications', NotificationController::class)
    ->parameters(['notifications' => 'notification']);

Route::get('/activities/{activity}/share', [ActivityController::class, 'share']);
Route::get('/activities/share/{token}', [ActivityController::class, 'openShareLink']);
