<?php

use App\Http\Middleware\FirebaseAuth;
use App\Http\Middleware\SetLocaleFromHeader;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
        then: function (Application $app) {
            Route::middleware([SetLocaleFromHeader::class, FirebaseAuth::class])
                ->prefix('auth')
                ->group(base_path('routes/auth.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {

        $middleware->appendToGroup('web', [
            SetLocaleFromHeader::class,
        ]);

        $middleware->appendToGroup('api', [
            SetLocaleFromHeader::class,
            FirebaseAuth::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {

                try {
                    $class = $e->getPrevious()->getModel();
                    $model = class_basename($class);

                    return response()->json(['message' => __('model.'.$model).' '.lcfirst(__('validation.not_found')), 'trace' => $e->getMessage()], 404);
                } catch (\Throwable $th) {
                    return response()->json(['message' => __('validation.not_found'), 'trace' => $e->getMessage()], 404);
                }
            }
        });
        $exceptions->render(function (UnauthorizedException $e, Request $request) {
            if ($request->is('api/*')) {

                return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 403);
            }
        });

        $exceptions->report(function (HttpExceptionInterface $e) {
            if ($e->getStatusCode() === 401) {
                // Don't report 401 errors to Sentry or other error tracking services
                return false;
            }
        });
    })
    ->create();
