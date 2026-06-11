<style>
    .logo-gradient {
            background: linear-gradient(135deg, #ff8c42, #ffa726);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
</style>

<div class="fixed z-50 w-full  py-4 px-4 bg-bg-elevated border border-white/10">
        <nav class=" flex justify-between items-center sm:px-6 lg:px-8">

            <a href="/"  class="text-3xl font-serif italic logo-gradient">
                {{ config('app.name') }}
            </a>
            <ul class="hidden md:flex gap-12 justify-center items-center">
                <li>
                    <a href="/#features" class="text-text-muted hover:text-white transition-colors relative group">
                        {{ __('index.nav.Features') }}
                        <span
                            class="absolute bottom-0 left-0 w-0 h-px bg-accent-orange transition-all group-hover:w-full"></span>
                    </a>
                </li>
                <li>
                    <a href="/#download" class="text-text-muted hover:text-white transition-colors relative group">
                        {{ __('index.nav.Download') }}
                        <span
                            class="absolute bottom-0 left-0 w-0 h-px bg-accent-orange transition-all group-hover:w-full"></span>
                    </a>
                </li>
                <li>
                    <a href="/#about" class="text-text-muted hover:text-white transition-colors relative group">
                        {{ __('index.nav.About') }}
                        <span
                            class="absolute bottom-0 left-0 w-0 h-px bg-accent-orange transition-all group-hover:w-full"></span>
                    </a>
                </li>
                <li>
                    <a href="/#contact" class="text-text-muted hover:text-white transition-colors relative group">
                        {{ __('index.nav.Support') }}
                        <span
                            class="absolute bottom-0 left-0 w-0 h-px bg-accent-orange transition-all group-hover:w-full"></span>
                    </a>
                </li>
                <li>
                    <form action="{{ route('lang.switch') }}" method="POST">
                        @csrf
                        <select name="locale" onchange="this.form.submit()"
                            class="bg-bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                            <option value="fr" {{ app()->getLocale() == 'fr' ? 'selected' : '' }}>🇫🇷 FR</option>
                            <option value="en" {{ app()->getLocale() == 'en' ? 'selected' : '' }}>🇬🇧 EN</option>
                        </select>
                    </form>
                </li>
            </ul>

        </nav>

    </div>