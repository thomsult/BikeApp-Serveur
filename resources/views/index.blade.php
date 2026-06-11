<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name') }} — {{ __('index.meta.title') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;600;800&display=swap"
        rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        body {
            font-family: "Manrope", sans-serif;
        }

        .gradient-mesh {
            background:
                radial-gradient(at 20% 30%,
                    rgba(255, 140, 66, 0.15) 0px,
                    transparent 50%),
                radial-gradient(at 80% 70%,
                    rgba(255, 167, 38, 0.12) 0px,
                    transparent 50%),
                radial-gradient(at 50% 50%,
                    rgba(255, 107, 74, 0.1) 0px,
                    transparent 50%);
        }

        .noise-overlay {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.03;
        }

        .gradient-text {
            background: linear-gradient(135deg, #ff8c42, #ff6b4a);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

       

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }

            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes float {

            0%,
            100% {
                transform: translateY(0px) rotate(0deg);
            }

            50% {
                transform: translateY(-20px) rotate(2deg);
            }
        }

        .animate-fadeInDown {
            animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInUp {
            animation: fadeInUp 1s ease-out;
        }

        .animate-fadeInUp-delay-200 {
            animation: fadeInUp 1s ease-out 0.2s both;
        }

        .animate-fadeInUp-delay-400 {
            animation: fadeInUp 1s ease-out 0.4s both;
        }

        .animate-fadeInUp-delay-600 {
            animation: fadeInUp 1s ease-out 0.6s both;
        }

        .animate-fadeInRight {
            animation: fadeInRight 1s ease-out 0.4s both;
        }

        .animate-float {
            animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay-1 {
            animation: float 6s ease-in-out infinite 1s;
        }

        .animate-float-delay-2 {
            animation: float 6s ease-in-out infinite 2s;
        }
    </style>
</head>

@include('cookie-consent::index')
<body class="bg-bg-dark text-white overflow-x-hidden">
   
    @if (session('success'))
    <div
        style="z-index: 9999; position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background-color: #166534; border: 1px solid #22c55e; color: #bbf7d0; padding: 12px 24px; border-radius: 10px; white-space: nowrap; display: flex; align-items: center; gap: 10px; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 600; box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);">
        ✅ {{ session('success') }}
    </div>
    @endif
    @if ($errors->any())
    <div
        style="z-index: 9999; position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background-color: #991b1b; border: 1px solid #ef4444; color: #fecaca; padding: 12px 24px; border-radius: 10px; white-space: nowrap; display: flex; align-items: center; gap: 10px; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 600; box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);">
        ❌ {{ $errors->first() }}
    </div>
    @endif

    <!-- Gradient Mesh Background -->
    <div class="fixed inset-0 gradient-mesh pointer-events-none z-0"></div>

    <!-- Noise Overlay -->
    <div class="fixed inset-0 noise-overlay pointer-events-none z-10"></div>

    @include('components.nav')
    <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Navigation -->

        <!-- Hero Section -->
        <section class="grid md:grid-cols-2 gap-8 md:gap-16 items-center relative py-16 md:py-32">
            <!-- Hero Content -->
            <div>
                <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl leading-tight mb-8 animate-fadeInUp-delay-200">
                    {{ $hero['title'] }}
                    <span class="gradient-text italic">{{ $hero['highlight'] }}</span>
                </h1>
                <p
                    class="text-lg sm:text-xl text-text-muted leading-relaxed mb-12 max-w-xl font-light animate-fadeInUp-delay-400">
                    {{ $hero['subtitle'] }}
                </p>
                <div class="flex flex-col items-center  gap-6 animate-fadeInUp-delay-600">

                    <a href="{{ $hero['app_store_link'] }}" class="" id="android-link">
                        <img style="height: 100px; width: 300px;"
                            src="https://raw.githubusercontent.com/pioug/google-play-badges/master/svg/{{ app()->getLocale() }}.svg"
                            alt="Télécharger sur Google Play">
                    </a>

                </div>
            </div>
            <!-- Hero Image -->
            <div class="relative animate-fadeInRight">
                <div
                    class="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-accent-orange/30">
                    <img src="{{ $image_url}}" alt="Cycliste sur une route de montagne au coucher du soleil"
                        class="w-full h-full object-cover rounded-xl" />
                    <div class="absolute inset-0 bg-gradient-to-br from-accent-orange/20 to-accent-coral/10"></div>
                </div>
            </div>

            <!-- Floating Cards (hidden on mobile) -->
            <div class="hidden lg:block absolute right-0 top-40 w-[500px] pointer-events-none">
                @foreach ($floating_card as $card)

                <div
                    class="absolute w-[280px] {{ $card['class'] }} bg-bg-elevated border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-float">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-orange to-accent-amber flex items-center justify-center text-2xl mb-4">
                        {{ $card['icon'] }}
                    </div>
                    <h3 class="text-lg font-semibold mb-2">{{ $card['title'] }}</h3>
                    <p class="text-sm text-text-muted">
                        {{ $card['description'] }}
                    </p>
                </div>
                @endforeach
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-16 md:py-32">
            <h2 class="font-serif text-4xl sm:text-5xl lg:text-6xl text-center mb-4 italic">
                {{ __('index.features.title') }}
                <span class="gradient-text">
                    {{ config('app.name') }}
                </span> ?
            </h2>
            <p class="text-center text-text-muted text-lg mb-20 max-w-2xl mx-auto">
                {{ __('index.features.description') }}

            </p>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                @foreach ($features as $feature)
                <div class="bg-bg-elevated border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-orange to-accent-amber flex items-center justify-center text-2xl mb-4">
                        {{ $feature['icon'] }}
                    </div>
                    <h3 class="text-lg font-semibold mb-2">{{ $feature['title'] }}</h3>
                    <p class="text-sm text-text-muted">{{ $feature['description'] }}</p>
                </div>
                @endforeach
            </div>
        </section>
        <section id="download" class="py-16 md:py-32">
            <h2 class="font-serif text-4xl sm:text-5xl lg:text-6xl text-center mb-4 italic">
                {{ __('index.download.title') }}
                <span class="gradient-text">
                    {{ config('app.name') }}
                </span>
                {{ __('index.download.subtitle') }}
            </h2>
            <p class="text-center text-text-muted text-lg mb-12 max-w-2xl mx-auto">
                {{ __('index.download.description') }}
            </p>
            <div class="flex justify-center">
                <a href="{{ $hero['app_store_link'] }}" class="" id="android-link">
                    <img style="height: 100px; width: 300px;"
                        src="https://raw.githubusercontent.com/pioug/google-play-badges/master/svg/{{ app()->getLocale() }}.svg"
                        alt="{{ __('index.download.alt_text') }}" />
                </a>
            </div>
        </section>
        <section id="about" class="py-16 md:py-32">
            <h2 class="font-serif text-4xl sm:text-5xl lg:text-6xl text-center italic">
                {{ __('index.about.title') }}
                <span class="gradient-text">
                    {{ config('app.name') }}
                </span>
            </h2>
            <div class="relative w-full mb-4 mt-4  rounded-3xl overflow-hidden shadow-2xl shadow-accent-orange/30">
                <img src="{{ $image_url }}" alt="Cycliste sur une route de montagne au coucher du soleil"
                    class="w-full h-full object-cover h-[500px] md:h-[600px]" />
                <div class="absolute inset-0 bg-gradient-to-br from-accent-orange/20 to-accent-coral/10"></div>
            </div>
            <p class="text-text-muted text-lg  mx-auto">
                {{ config('app.name') }} {{ __('index.about.description') }}
            </p>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-16 md:py-32">
           

            <div class="flex-row md:flex  gap-4  mx-auto">
                
                   <img src="{{ $image_url_1 }}" alt="Cycliste sur une route de montagne au coucher du soleil"
                        class=" object-cover rounded-xl" style="width: 50%;" />
                    
                <form action="#" method="POST" class="flex flex-1 flex-col gap-4 ">
                    @csrf
                     <h2 class="font-serif text-4xl sm:text-5xl lg:text-6xl text-center mb-4 italic">
                {{ __('index.contact.title') }}
            </h2>
            <p class="text-center text-text-muted text-lg mb-20 max-w-2xl mx-auto">
                {{ __('index.contact.description') }}
            </p>

                    <!-- Nom -->
                    <div class="flex flex-col gap-2">
                        <label for="name" class="text-sm font-semibold text-text-muted tracking-widest">
                            {{ __('index.contact.name') }}
                        </label>
                        <input required type="text" id="name" name="name"
                            placeholder="{{ __('index.contact.name_placeholder') }}"
                            class="bg-bg-dark border border-white/10 rounded-xl px-6 py-4 text-white placeholder-text-muted focus:outline-none focus:border-accent-orange transition-colors" />
                    </div>

                    <!-- Email -->
                    <div class="flex flex-col gap-2">
                        <label for="email" class="text-sm font-semibold text-text-muted tracking-widest">
                            {{ __('index.contact.email') }}
                        </label>
                        <input required type="email" id="email" name="email"
                            placeholder="{{ __('index.contact.email_placeholder') }}"
                            class="bg-bg-dark border border-white/10 rounded-xl px-6 py-4 text-white placeholder-text-muted focus:outline-none focus:border-accent-orange transition-colors" />
                    </div>

                    <!-- Sujet -->
                    <div class="flex flex-col gap-2">
                        <label for="subject" class="text-sm font-semibold text-text-muted tracking-widest">
                            {{ __('index.contact.subject') }}
                        </label>
                        <select required id="subject" name="subject"
                            class="py-4 w-full  border-r-8 rounded-xl   px-4 text-sm outline outline-neutral-700 bg-bg-dark  border border-white/10  text-white focus:outline-none focus:border-accent-orange transition-colors appearance-none">
                            <option value="" disabled selected class="text-text-muted">
                                {{ __('index.contact.subject_select') }}
                            </option>

                            <option value="bug">
                                🐛 {{ __('index.contact.subject_bug') }}
                            </option>

                            <option value="suggestion">
                                💡 {{ __('index.contact.subject_suggestion') }}
                            </option>

                            <option value="question">
                                ❓ {{ __('index.contact.subject_question') }}
                            </option>

                            <option value="autre">
                                ✉️ {{ __('index.contact.subject_other') }}
                            </option>
                        </select>
                    </div>

                    <!-- Message -->
                    <div class="flex flex-col gap-2 ">
                        <label for="message" class="text-sm font-semibold text-text-muted tracking-widest">
                            {{ __('index.contact.message') }}
                        </label>
                        <textarea id="message" name="message" rows="5"
                            placeholder="{{ __('index.contact.message_placeholder') }}"
                            class="bg-bg-dark border border-white/10 rounded-xl px-6 py-4 text-white placeholder-text-muted focus:outline-none focus:border-accent-orange transition-colors resize-none"></textarea>
                    </div>

                    <!-- Submit -->
                    <button type="submit"
                        class="mt-4 px-10 py-4 rounded-xl bg-gradient-to-r from-accent-orange to-accent-coral text-white font-semibold shadow-lg shadow-accent-orange/40 hover:shadow-accent-orange/50 hover:-translate-y-0.5 transition-all text-center">
                        {{ __('index.contact.send') }} ✉️
                    </button>
                </form>
                
            </div>
        </section>
        <!-- Footer -->
        
    </div>
    @include('components.footer')

    <script>
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(
                    this.getAttribute("href"),
                );
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            });
        });

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }
                });
            },
            {
                threshold: 0.1,
            },
        );

        document.querySelectorAll(".feature-card").forEach((card) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(30px)";
            card.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";
            observer.observe(card);
        });
    </script>
</body>

</html>