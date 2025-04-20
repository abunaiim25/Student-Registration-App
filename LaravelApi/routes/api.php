<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

//=====================AUTH==============================
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('/me', [ProfileController::class, 'me'])->middleware('auth:sanctum');
    Route::post('update-profile/{id}', [ProfileController::class, 'update']);
});

//=====================ADMIN==============================
Route::middleware(['auth:sanctum', 'isAPIAdmin'])->group(function () {
    Route::get('getAllUser', [AdminController::class, 'getAllUser']);

    Route::get('/checkingAuthenticated', function () {
        return response()->json(['message' => 'You are in', 'status' => 200], 200);
    });    
});

