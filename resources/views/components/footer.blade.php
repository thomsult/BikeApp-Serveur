<footer
    class="px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10 mt-24 flex flex-col md:flex-row justify-between items-center gap-8"
>
    <aside class="grid-flow-col items-center">
        <p>
            <a href="/" class="text-sm text-text-muted">
                {{ config("app.name") }} &copy; {{ date("Y") }}.
            </a>
        </p>
    </aside>
    <nav
        class="text-base-content grid-flow-col gap-4 md:place-self-center md:justify-self-end flex items-center"
    >
        <a class="text-sm text-text-muted" href="/privacy-policy">
            {{ __("index.footer.privacy_policy") }}
        </a>
        <a class="text-sm text-text-muted" href="/terms-of-service">
            {{ __("index.footer.terms_of_service") }}
        </a>
    </nav>
</footer>
