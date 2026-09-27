<?php

use App\Http\Controllers\PathaoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/pathao/cities', [PathaoController::class, 'cities']);
Route::get('/pathao/zones/{city_id}', [PathaoController::class, 'zones']);
Route::get('/pathao/areas/{zone_id}', [PathaoController::class, 'areas']);

Route::post('/pathao/calculate-price', [PathaoController::class, 'calculatePrice']);

Route::get('/pathao/getpathaostore', [PathaoController::class, 'getStores'])->name('pathao.store');
