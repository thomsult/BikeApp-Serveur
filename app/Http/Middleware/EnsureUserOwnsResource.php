<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserOwnsResource
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Profile ID is in the route parameters, we compare it with the authenticated user's Firebase UID
        if ($request->route()->parameters()['profile'] != $user->firebase_uid) {
            return abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
