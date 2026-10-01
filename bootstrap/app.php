<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
$middleware->web(append: [
            \App\Http\Middleware\ResolveAuthGuard::class,
            \App\Http\Middleware\SeoMeta::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

$middleware->alias([
            'role' => \App\Http\Middleware\Role::class,
            'blocked' => \App\Http\Middleware\EnsureNotBlocked::class,
        ]);
    })
->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $e instanceof HttpException) {
                return null;
            }

            if ($request->is('api/*') || $request->expectsJson()) {
                return null;
            }

            $status = $e->getStatusCode();

            return Inertia::render('Errors/NotFound', [
                'status' => $status,
            ])->toResponse($request)->setStatusCode($status);
        });
    })->create();
