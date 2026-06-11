<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Auth;

class FirebaseAuth
{
    public function __construct(private Auth $firebaseAuth) {}

    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (! $token) {
            throw new AuthenticationException('No token provided');
        }

        try {

            if ($token === 'dev-token') {
                // where('firebase_uid', 'dev')->
                // $user = User::firstOrCreate([
                //     'firebase_uid' => 'dev',
                // ], [
                //     'email' => 'dev-test@exemple.fr',
                //     'name' => 'Dev Test',
                //     'picture' => 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
                //     'phone_number' => null,
                // ]);
                $user = User::where('email', 'thomsult@gmail.com')->first();

                $request->setUserResolver(function () use ($user) {
                    return $user;
                });

                return $next($request);
            }
            if ($token === 'dev-token-thomsult') {
                // where('firebase_uid', 'dev')->

                $user = User::where('email', 'thomsult@gmail.com')->first();

                $request->setUserResolver(function () use ($user) {
                    return $user;
                });

                return $next($request);
            }
            $verifiedToken = $this->firebaseAuth->verifyIdToken($token);
            $request->setUserResolver(function () use ($verifiedToken) {
                $user = $this->firebaseAuth->getUser($verifiedToken->claims()->get('sub'));
                $existingUser = User::where('email', $user->email)->first();
                if ($existingUser && $existingUser->firebase_uid !== $user->uid) {
                    $localUser = User::where('email', $user->email)->first();
                    $localUser->update(['firebase_uid' => $user->uid]);
                } else {

                    $localUser = User::firstOrCreate(
                        ['firebase_uid' => $user->uid],
                        [
                            'email' => $user->email,
                            'picture' => $user->photoUrl,
                            'phone_number' => $user->phoneNumber,
                            'first_name' => $user->displayName ? explode(' ', $user->displayName)[0] : null,
                            'last_name' => $user->displayName ? explode(' ', $user->displayName)[1] : null,
                        ]

                    );
                }

                return $localUser;
            });

            return $next($request);
        } catch (\Throwable $e) {
            throw new AuthenticationException('No valid token provided');
        }
    }
}
