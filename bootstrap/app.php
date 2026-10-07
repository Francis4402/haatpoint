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

            // SeoMeta is web-route middleware, so it never ran for an unmatched
            // URL, and for a matched route it was still describing the route and
            // not the failure. Re-share both the view tags and the Inertia prop,
            // otherwise a 404 advertises `index, follow` plus a canonical
            // pointing at the home page.
            $seo = \App\Http\Middleware\SeoMeta::errorFor($status);
            \Illuminate\Support\Facades\View::share('seo', $seo);
            Inertia::share('seo', $seo);

            return Inertia::render('Errors/NotFound', [
                'status' => $status,
            ])->toResponse($request)->setStatusCode($status);
        });
    })->create();
