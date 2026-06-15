{{-- resources/views/index.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }} — {{ __('index.meta.title') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

@include('cookie-consent::index')

<body class="bg-[#0e0e0f] text-white font-[Manrope] overflow-x-hidden">

    {{-- Flash messages --}}
    @if (session('success'))
    <div
        class="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-green-900 border border-green-500 text-green-200 px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-lg whitespace-nowrap">
        ✅ {{ session('success') }}
    </div>
    @endif
    @if ($errors->any())
    <div
        class="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-red-900 border border-red-500 text-red-200 px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-lg whitespace-nowrap">
        ❌ {{ $errors->first() }}
    </div>
    @endif

    @include('components.nav')
    <section class="max-w-[1100px] mx-auto px-8 pt-20 pb-12 grid md:grid-cols-2 gap-16 items-center">
        <div>
            <div class="flex flex-wrap gap-3 mb-2">
                <div
                    class="inline-flex items-center gap-1.5 bg-[#ff8c42]/10 border border-[#ff8c42]/30 rounded-full px-3.5 py-1.5 text-xs text-[#ff8c42] font-medium mb-6">
                    {{ __('index.cards.multi-langue.icon')
                    }} Application {{ __('index.cards.multi-langue.title') }}
                </div>
                <div
                    class="inline-flex items-center gap-1.5 bg-[#ff8c42]/10 border border-[#ff8c42]/30 rounded-full px-3.5 py-1.5 text-xs text-[#ff8c42] font-medium mb-6">
                    {{ __('index.cards.multi-plateforme.icon') }} Application {{
                    __('index.cards.multi-plateforme.title') }}
                </div>
            </div>
            <h1 class="text-5xl lg:text-[52px] font-light leading-[1.1] tracking-[-1.5px] mb-5">
                {{ $hero['title'] }}<br>
                <span class="font-medium bg-gradient-to-r from-[#ff8c42] to-[#ff6b4a] bg-clip-text text-transparent">
                    {{ $hero['highlight'] }}
                </span>
            </h1>
            <p class="text-base text-white/40 leading-7 mb-10 max-w-md font-light">
                {{ $hero['subtitle'] }}
            </p>
            <div class="flex flex-col gap-3 max-w-xs">
                <a href="https://app.bikeapp.dpdns.org"
                    class="flex items-center justify-between bg-[#ff8c42] text-white rounded-xl px-5 py-3.5 text-[15px] font-medium hover:opacity-90 transition-opacity">
                    <span>
                        {{ __('index.nav.OpenApp') }}
                    </span>
                    <span>→</span>
                </a>
                <a href="#install"
                    class="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.12] rounded-xl px-5 py-3.5 text-sm text-white/55 hover:bg-white/[0.07] transition-colors">
                    ⬇️ <span class="font-medium">{{ __('index.download.alt_text') }}</span>
                </a>
            </div>
        </div>
        {{-- Vous pouvez mettre une vraie image ici --}}
        <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#ff8c42]/20 h-[500px]">
            <img src="{{ $image_url }}" alt="" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-br from-[#ff8c42]/20 to-[#ff6b4a]/10"></div>
        </div>
    </section>

    {{-- STATS BAR --}}
    <div class="max-w-[1100px] mx-auto px-8 mb-16">
        <div class="grid grid-cols-3 border border-white/[0.08] rounded-2xl overflow-hidden">
            <div class="px-10 py-8 border-r border-white/[0.08] text-center">
                <div class="text-4xl font-light tracking-[-1px] text-[#ff8c42]">{{ __('index.cards.multi-langue.icon')
                    }}</div>
                <div class="text-sm text-white/30 mt-0.5">{{ __('index.cards.multi-langue.title') }}</div>
            </div>
            <div class="px-10 py-8 border-r border-white/[0.08] text-center">
                <div class="text-4xl font-light tracking-[-1px] text-[#ff8c42]">{{
                    __('index.cards.multi-plateforme.icon') }}</div>
                <div class="text-sm text-white/30 mt-0.5">{{ __('index.cards.multi-plateforme.title') }}</div>
            </div>
            <div class="px-10 py-8 text-center">
                <div class="text-4xl font-light tracking-[-1px] text-[#ff8c42]">{{ __('index.cards.free.icon') }}</div>
                <div class="text-sm text-white/30 mt-0.5">{{ __('index.cards.free.title') }}</div>
            </div>
        </div>
    </div>

    {{-- FEATURES --}}
    <section id="features" class="max-w-[1100px] mx-auto px-8 py-16">
        <p class="text-[11px] font-medium text-[#ff8c42] tracking-[2px] uppercase mb-3">
            {{ __('index.nav.Features') }}
        </p>
        <h2 class="text-4xl font-light tracking-[-1px] leading-[1.15] mb-4">
            {{ __('index.features.title') }}<br>
            <span class="bg-gradient-to-r from-[#ff8c42] to-[#ff6b4a] bg-clip-text text-transparent">
                {{ config('app.name') }}
            </span>
        </h2>
        <p class="text-[15px] text-white/40 max-w-lg leading-7 mb-12">{{ __('index.features.description') }}</p>

        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden">
            @foreach ($features as $feature)
            <div class="bg-[#0e0e0f] p-8 hover:bg-[#141416] transition-colors">
                <div class="w-10 h-10 rounded-xl bg-[#ff8c42]/10 flex items-center justify-center text-xl mb-4">
                    {{ $feature['icon'] }}
                </div>
                <h3 class="text-[15px] font-medium mb-2">{{ $feature['title'] }}</h3>
                <p class="text-sm text-white/35 leading-[1.65]">{{ $feature['description'] }}</p>
            </div>
            @endforeach
        </div>
    </section>

    {{-- PWA INSTALL --}}
    <section id="install" class="max-w-[1100px] mx-auto px-8 pb-16">
        <div
            class="bg-[#ff8c42]/[0.05] border border-[#ff8c42]/[0.15] rounded-3xl p-12 grid md:grid-cols-[1fr_auto] gap-12 items-center">
            <div>
                <p class="text-[11px] font-medium text-[#ff8c42] tracking-[2px] uppercase mb-3">
                    {{ __('index.nav.OpenApp') }}
                </p>
                <h2 class="text-3xl font-light tracking-[-0.8px] mb-3">
                    {{ __('index.download.title') }}<br>
                </h2>
                <p class="text-sm text-white/40 leading-7 max-w-lg mb-6">{{ __('index.download.description') }}</p>
                <a href="https://app.bikeapp.dpdns.org" rel="noopener noreferrer" target="_blank" role="button"
                    class="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-sm font-mono text-white/70 mb-6">
                    🔗 app.bikeapp.dpdns.org
                </a>
                <ul class="flex flex-col gap-2">
                    <li class="flex items-center gap-2.5 text-sm text-white/40">
                        {{ __('index.download.workflow.step.1') }}
                    </li>
                    <li class="flex items-center gap-2.5 text-sm text-white/40">
                        {{ __('index.download.workflow.step.2') }}
                    </li>
                    <li class="flex items-center gap-2.5 text-sm text-white/40">
                        {{ __('index.download.workflow.step.3') }}
                    </li>
                </ul>
            </div>
            <div class="text-center">
                <div class="w-36 h-36 bg-white rounded-2xl flex items-center justify-center mx-auto">
                    <img src="data:image/png;base64,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"
                        alt="PWA Install" class="w-24 h-24 object-contain" />
                </div>
                <p class="text-[11px] text-white/25 mt-3">
                    {{ __('index.download.note') }}
                </p>
            </div>
        </div>
    </section>

    {{-- CONTACT --}}
    <section id="contact" class="max-w-[1100px] mx-auto px-8 py-16 grid md:grid-cols-2 gap-16 items-start">
        <div>
            <p class="text-[11px] font-medium text-[#ff8c42] tracking-[2px] uppercase mb-3">{{ __('index.nav.Support')
                }}</p>
            <h2 class="text-4xl font-light tracking-[-0.8px] leading-[1.2] mb-4">{{ __('index.contact.title') }}
            </h2>
            <p class="text-sm text-white/40 leading-7 mb-8">{{ __('index.contact.description') }}</p>
            <a href="mailto:support@bikeapp.fr" class="flex items-center gap-2.5 text-sm text-white/35 mb-3">📧
                support@bikeapp.fr</a>
            <div class="flex items-center gap-2.5 text-sm text-white/35 mb-3">🕐 {{ __('index.contact.response_time') }}
            </div>
            <div class="flex items-center gap-2.5 text-sm text-white/35">📍 {{ __('index.contact.location') }}</div>
        </div>

        <form action="#" method="POST" class="flex flex-col gap-4">
            @csrf
            <div class="flex flex-col gap-1.5">
                <label for="name" class="text-xs font-medium text-white/35 tracking-wide">{{
                    __('index.contact.name')
                    }}</label>
                <input type="text" id="name" name="name" required
                    placeholder="{{ __('index.contact.name_placeholder') }}"
                    class="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#ff8c42]/50 transition-colors" />
            </div>
            <div class="flex flex-col gap-1.5">
                <label for="email" class="text-xs font-medium text-white/35 tracking-wide">{{
                    __('index.contact.email')
                    }}</label>
                <input type="email" id="email" name="email" required
                    placeholder="{{ __('index.contact.email_placeholder') }}"
                    class="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#ff8c42]/50 transition-colors" />
            </div>
            <div class="flex flex-col gap-1.5">
                <label for="subject" class="text-xs font-medium text-white/35 tracking-wide">{{
                    __('index.contact.subject') }}</label>
                <select id="subject" name="subject" required
                    class="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white/55 text-sm focus:outline-none focus:border-[#ff8c42]/50 transition-colors appearance-none">
                    <option value="" disabled selected>{{ __('index.contact.subject_select') }}</option>
                    <option value="bug">🐛 {{ __('index.contact.subject_bug') }}</option>
                    <option value="suggestion">💡 {{ __('index.contact.subject_suggestion') }}</option>
                    <option value="question">❓ {{ __('index.contact.subject_question') }}</option>
                    <option value="autre">✉️ {{ __('index.contact.subject_other') }}</option>
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label for="message" class="text-xs font-medium text-white/35 tracking-wide">{{
                    __('index.contact.message') }}</label>
                <textarea id="message" name="message" rows="5"
                    placeholder="{{ __('index.contact.message_placeholder') }}"
                    class="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#ff8c42]/50 transition-colors resize-none leading-relaxed"></textarea>
            </div>
            <button type="submit"
                class="bg-[#ff8c42] text-white rounded-xl px-6 py-3.5 text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                ✉️ {{ __('index.contact.send') }}
            </button>
        </form>
    </section>

    @include('components.footer')

    <script>
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    </script>
</body>

</html>