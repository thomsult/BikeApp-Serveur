<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class SetLocaleFromHeader
{
    public function handle(Request $request, Closure $next)
    {
        // 1️⃣ priorité : session (sélecteur langue)
        if (Session::has('locale')) {
            $locale = Session::get('locale');
        }
        // 2️⃣ utilisateur connecté
        elseif ($request->user()?->language) {
            $locale = $request->user()->language;
        }
        // 3️⃣ navigateur
        else {
            $locale = $request->header('Accept-Language', config('app.locale'));
        }

        // Nettoyage fr-FR -> fr
        $locale = substr($locale, 0, 2);

        if (! in_array($locale, ['fr', 'en'])) {
            $locale = config('app.locale');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
