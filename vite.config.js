import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        allowedHosts: ['vite.bikeapp.local', 'api.bikeapp.local'],
        port: 5172,
        cors: true,
        origin: 'https://vite.bikeapp.local',
        hmr: {
            host: 'vite.bikeapp.local',
            protocol: 'wss',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
