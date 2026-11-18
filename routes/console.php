<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Auto-sync products from configured scrape URL regularly:
 * Runs daily at 04:00 AM, automatically keeping products,
 * variants, sharp images, and accurate brands up to date.
 */
Schedule::command('shopbase:sync')
    ->dailyAt('04:00')
    ->withoutOverlapping()
    ->runInBackground();
