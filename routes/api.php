<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivityTypeController;
use App\Http\Controllers\BikeController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\ComponentsBikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::apiResource('profile', UserController::class)->parameters(['profile' => 'user']);

Route::apiResource('activities/types', ActivityTypeController::class)
    ->parameters(['types' => 'typeActivity']);

Route::apiResource('activities', ActivityController::class)
    ->parameters(['activities' => 'activity']);

Route::get('bikes/types', [BikeController::class, 'getTypeBikeIndex']);
Route::get('bikes/types/{typeBike}', [BikeController::class, 'getTypeBikeShow']);
Route::get('bikes/components/brands', [ComponentsBikeController::class, 'getComponentsBrandIndex']);
Route::get('bikes/components/brands/{brand}', [ComponentsBikeController::class, 'getComponentsBrandShow']);
Route::get('bikes/components/types', [ComponentsBikeController::class, 'getComponentsTypeIndex']);
Route::get('bikes/components/types/{type}', [ComponentsBikeController::class, 'getComponentsTypeShow']);

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
