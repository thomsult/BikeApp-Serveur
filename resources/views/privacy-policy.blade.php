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
    <!-- <div class="fixed inset-0 gradient-mesh pointer-events-none z-0"></div> -->

    <!-- Noise Overlay -->
    <!-- <div class="fixed inset-0 noise-overlay pointer-events-none z-10"></div> -->

    @include('components.nav')
    <main class="container mx-auto px-4 relative z-20 mb-auto flex-1 max-w-5xl">
        <section class="mt-8">
            <h1 class="text-3xl font-bold mb-4">
                {{ __("privacy_policy.title") }}
            </h1>
            <p class="mb-4">{{ __("privacy_policy.intro") }}</p>
        </section>
        <section class="mt-8">

            <h2 class="text-2xl font-semibold mb-2">
                {{ __("privacy_policy.data_collection") }}
            </h2>
            <p class="mb-4">{{ __("privacy_policy.data_collection_desc") }}</p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("privacy_policy.data_use") }}
            </h2>
            <p class="mb-4">{{ __("privacy_policy.data_use_desc") }}</p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("privacy_policy.data_sharing") }}
            </h2>
            <p class="mb-4">{{ __("privacy_policy.data_sharing_desc") }}</p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("privacy_policy.user_rights") }}
            </h2>
            <p class="mb-4">{{ __("privacy_policy.user_rights_desc") }}</p>
        </section>
        <section class="mt-8">
            <h2 class="text-2xl font-semibold mb-2">
                {{ __("privacy_policy.contact_info") }}
            </h2>
            <p>{{ __("privacy_policy.contact_info_desc") }}</p>
        </section>
    </main>
    @include('components.footer')
</body>

</html>