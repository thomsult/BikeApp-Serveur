FROM dunglas/frankenphp:latest AS base

WORKDIR /app

RUN apt-get update \
    && apt-get install -y unzip git \
    && rm -rf /var/lib/apt/lists/*

RUN install-php-extensions \
    pdo_mysql \
    opcache \
    intl \
    zip

FROM composer:latest AS composer

WORKDIR /app

COPY . .

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

FROM base AS app

WORKDIR /app

ENV SERVER_NAME=localhost
ENV SERVER_ROOT=/app/public

COPY . .

COPY --from=composer /app/vendor ./vendor

RUN chown -R www-data:www-data /app \
    && chmod -R 775 storage bootstrap/cache

COPY .docker/php/docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]