<?php

use App\Http\Controllers\ConfigController;
use App\Http\Middleware\FirebaseAuth;
use App\Mail\ContactMail;
use App\Service\DeepLinksHelper;
use App\Service\EncryptionHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $imageUrl = ConfigController::welcomeRandomImage();

    return view('index', [
        'appName' => config('app.name'),
        'image_url' => $imageUrl,
        'image_url_1' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',

        'hero' => [
            'title' => __('index.hero.title'),
            'highlight' => __('index.hero.highlight'),
            'subtitle' => __('index.hero.subtitle'),
            'app_store_link' => 'https://play.google.com/store/apps/details?id=com.bikeapp',
        ],

        'floating_card' => [
            [
                'icon' => '📍',
                'title' => __('index.cards.gps.title'),
                'description' => __('index.cards.gps.description'),
                'class' => 'top-20 left-0',
            ],
            [
                'icon' => '🗺️',
                'title' => __('index.cards.routes.title'),
                'description' => __('index.cards.routes.description'),
                'class' => 'bottom-24 right-12',
            ],
            [
                'icon' => '🛠️',
                'title' => __('index.cards.maintenance.title'),
                'description' => __('index.cards.maintenance.description'),
                'class' => 'top-32 left-32',
            ],
        ],

        'features' => [
            [
                'icon' => '📊',
                'title' => __('index.features.stats.title'),
                'description' => __('index.features.stats.description'),
            ],
            [
                'icon' => '🗺️',
                'title' => __('index.features.maps.title'),
                'description' => __('index.features.maps.description'),
            ],
            [
                'icon' => '🏆',
                'title' => __('index.features.badges.title'),
                'description' => __('index.features.badges.description'),
            ],
            [
                'icon' => '🛠️',
                'title' => __('index.features.maintenance.title'),
                'description' => __('index.features.maintenance.description'),
            ],
            [
                'icon' => '💬',
                'title' => __('index.features.share.title'),
                'description' => __('index.features.share.description'),
            ],
            [
                'icon' => '📱',
                'title' => __('index.features.notifications.title'),
                'description' => __('index.features.notifications.description'),
            ],
        ],
    ]);
});
Route::post('/', function (Request $request) {

    $validated = $request->validate([
        'name' => 'required|string|max:255|min:2',
        'email' => 'required|email|max:255',
        'subject' => 'required|string|max:255|in:bug,suggestion,question,autre',
        'message' => 'required|string|max:1000',
    ], [

        'name.required' => __('contact.validation.name_required'),
        'name.string' => __('contact.validation.name_string'),
        'name.max' => __('contact.validation.name_max'),
        'name.min' => __('contact.validation.name_min'),

        'email.required' => __('contact.validation.email_required'),
        'email.email' => __('contact.validation.email_email'),
        'email.max' => __('contact.validation.email_max'),

        'subject.required' => __('contact.validation.subject_required'),
        'subject.string' => __('contact.validation.subject_string'),
        'subject.max' => __('contact.validation.subject_max'),
        'subject.in' => __('contact.validation.subject_in'),

        'message.required' => __('contact.validation.message_required'),
        'message.string' => __('contact.validation.message_string'),
        'message.max' => __('contact.validation.message_max'),

    ]);

    Mail::to('thomsult+bikeapp@gmail.com')->send(new ContactMail($validated));

    return redirect()->back()->with(
        'success',
        __('contact.success', ['name' => $validated['name']])
    );

})->name('success-message');

Route::post('/lang-switch', function () {

    $locale = request('locale');

    if (in_array($locale, ['fr', 'en'])) {
        Session::put('locale', $locale);
    }

    return back();

})->name('lang.switch');

Route::get('/privacy-policy', function () {
    return view('privacy-policy');
})->name('privacy_policy');
Route::get('/terms-of-service', function () {
    return view('terms-of-service');
})->name('terms_of_service');

Route::get('/firebase-test', function () {
    return 'Firebase test route';
})->middleware(['api', FirebaseAuth::class]);

Route::get('/assets/images/welcome-bg', [ConfigController::class, 'welcome']);
Route::get('assets/images/onboarding/{filename}', [ConfigController::class, 'image']);

Route::get('/redirect-app', function (Request $request) {
    $key = $request->get('ride') ?? '';
    if (empty($key)) {
        return view('redirect-app', ['deepLink' => DeepLinksHelper::appBaseLink()]);
    }
    $data = json_decode(EncryptionHelper::decrypt($key), true);
    if (empty($data)) {
        return view('redirect-app', ['deepLink' => DeepLinksHelper::appBaseLink()]);
    }

    return view('redirect-app', ['deepLink' => DeepLinksHelper::createDeepLink($data)]);
})->name('redirect_app');
