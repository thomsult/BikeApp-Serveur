<?php

use App\Http\Controllers\UserController;
use App\Http\Middleware\FirebaseAuth;
use Illuminate\Support\Facades\Route;

Route::withoutMiddleware(FirebaseAuth::class)->group(function () {
    Route::post('/forget-password', [UserController::class, 'forgetPassword']);
    // Route::post('/reset-password', [UserController::class, 'resetPassword']);
});
Route::get('/login', [UserController::class, 'loginForm'])->name('login');
Route::post('/login', [UserController::class, 'login']);

Route::post('/logout', [UserController::class, 'logout']);
