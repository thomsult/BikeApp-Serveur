<footer class="border-t border-white/[0.07] mt-16">
    <div class="max-w-[1100px] mx-auto px-8 py-12">

        {{-- Top --}}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {{-- Brand --}}
            <div class="md:col-span-2">
                <a href="/" class="flex items-center gap-2 text-lg font-medium text-[#ff8c42] mb-3">
                    🚴 {{ config('app.name') }}
                </a>
                <p class="text-sm text-white/35 leading-7 max-w-xs">
                    {{ __('index.footer.tagline') }}
                </p>
                <a href="https://app.bikeapp.dpdns.org"
                    class="inline-flex items-center gap-2 mt-5 bg-[#ff8c42]/10 border border-[#ff8c42]/25 text-[#ff8c42] text-sm px-4 py-2 rounded-lg hover:bg-[#ff8c42]/15 transition-colors">
                    🔗 app.bikeapp.dpdns.org
                </a>
            </div>

            {{-- App --}}
            <div>
                <p class="text-[11px] font-medium text-white/25 tracking-[2px] uppercase mb-4">{{
                    __('index.footer.download') }}</p>
                <ul class="flex flex-col gap-3">
                    <li><a href="#features" class="text-sm text-white/40 hover:text-white transition-colors">{{
                            __('index.nav.Features') }}</a></li>
                    <li><a href="#install" class="text-sm text-white/40 hover:text-white transition-colors">{{
                            __('index.download.title') }}</a></li>
                    <li><a href="https://app.bikeapp.dpdns.org"
                            class="text-sm text-white/40 hover:text-white transition-colors">{{
                            __('index.footer.download') }}</a></li>
                </ul>
            </div>

            {{-- Legal --}}
            <div>
                <p class="text-[11px] font-medium text-white/25 tracking-[2px] uppercase mb-4">{{
                    __('index.footer.legal') }}</p>
                <ul class="flex flex-col gap-3">
                    <li><a href="/privacy-policy" class="text-sm text-white/40 hover:text-white transition-colors">{{
                            __('index.footer.privacy_policy') }}</a></li>
                    <li><a href="/terms-of-service" class="text-sm text-white/40 hover:text-white transition-colors">{{
                            __('index.footer.terms_of_service') }}</a></li>
                    <li><a href="#contact" class="text-sm text-white/40 hover:text-white transition-colors">{{
                            __('index.nav.Support') }}</a>
                    </li>
                </ul>
            </div>

        </div>

        {{-- Bottom --}}
        <div class="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-xs text-white/20">
                © {{ date('Y') }} {{ config('app.name') }} — {{ __('index.footer.rights') }}
            </p>
            <div class="flex items-center gap-1.5 text-xs text-white/20">
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                {{ __('index.footer.status') }}
            </div>
        </div>

    </div>
</footer>