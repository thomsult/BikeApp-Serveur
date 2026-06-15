<nav class="sticky top-0 z-50 backdrop-blur-md bg-[#0e0e0f]/85 border-b border-white/[0.08]">
    <div class="max-w-[1100px] mx-auto px-8 py-5 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-lg font-medium text-[#ff8c42]">
            🚴 {{ config('app.name') }}
        </a>
        <div class="hidden md:flex gap-8">
            <a href="#features" class="text-sm text-white/40 hover:text-white transition-colors">{{
                __('index.nav.About') }}</a>
            <a href="#features" class="text-sm text-white/40 hover:text-white transition-colors">{{
                __('index.nav.Features') }}</a>
            <a href="#install" class="text-sm text-white/40 hover:text-white transition-colors">{{
                __('index.nav.Download') }}</a>
            <a href="#contact" class="text-sm text-white/40 hover:text-white transition-colors">{{
                __('index.nav.Support') }}</a>
        </div>
        <div>
            <form action="{{ route('lang.switch') }}" method="POST">
                @csrf
                <select name="locale" onchange="this.form.submit()"
                    class="bg-bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                    <option value="fr" {{ app()->getLocale() == 'fr' ? 'selected' : '' }}>🇫🇷 FR</option>
                    <option value="en" {{ app()->getLocale() == 'en' ? 'selected' : '' }}>🇬🇧 EN</option>
                </select>
            </form>
        </div>
        <a href="https://app.bikeapp.dpdns.org"
            class="bg-[#ff8c42] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            {{ __('index.nav.OpenApp') }} →
        </a>
    </div>
</nav>