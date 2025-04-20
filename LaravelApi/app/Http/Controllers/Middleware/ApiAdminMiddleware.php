<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class ApiAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
{
    Log::info('Middleware Hit');

    if (Auth::check()) {
        Log::info('Authenticated as: ' . auth()->user()->email);
        
        if (auth()->user()->tokenCan('server:admin')) {
            return $next($request);
        } else {
            Log::warning('Access denied: missing admin token');
            return response()->json([
                'message' => 'Access Denied...! As you are not an admin.',
            ], 403);
        }
    } else {
        Log::warning('Auth failed');
        return response()->json([
            'status' => 401,
            'message' => 'Please Login First',
        ]);
    }
}
}
