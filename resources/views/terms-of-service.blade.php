<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ __("privacy_policy.title") }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;600;800&display=swap"
        rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @include('cookie-consent::index')

</head>

<body class="bg-bg-dark text-white overflow-x-hidden flex flex-col min-h-screen">

    <!-- Gradient Mesh Background -->
    <div class="fixed inset-0 gradient-mesh pointer-events-none z-0"></div>

    <!-- Noise Overlay -->
    <div class="fixed inset-0 noise-overlay pointer-events-none z-10"></div>

    @include('components.nav')
    <main class="container mx-auto px-4 relative z-20 mb-auto flex-1" style="padding-top: 100px;">
        <section class="mt-32" >
            <h1 class="text-3xl font-bold mb-4">
                {{ __("terms_of_service.title") }}
            </h1>
            <p class="mb-4">{{ __("terms_of_service.intro") }}</p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("terms_of_service.user_conduct") }}
            </h2>
            <p class="mb-4">{{ __("terms_of_service.user_conduct_desc") }}</p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("terms_of_service.intellectual_property") }}
            </h2>
            <p class="mb-4">
                {{ __("terms_of_service.intellectual_property_desc") }}
            </p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("terms_of_service.disclaimer") }}
            </h2>
            <p class="mb-4">{{ __("terms_of_service.disclaimer_desc") }}</p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("terms_of_service.limitation_of_liability") }}
            </h2>
            <p class="mb-4">
                {{ __("terms_of_service.limitation_of_liability_desc") }}
            </p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("terms_of_service.governing_law") }}
            </h2>
            <p>{{ __("terms_of_service.governing_law_desc") }}</p>
        </section>
    </main>
    @include('components.footer')
</body>

</html>