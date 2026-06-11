#!/bin/sh
set -e

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec frankenphp run --config /app/.docker/php/caddy.dev --adapter caddyfile