# EchoHub Production Dockerfile
# Optimized for Laravel 12 with Inertia.js + React on Dokploy
# Last deployment: 2025-10-08

# Stage 1: Build frontend assets
FROM node:20-bookworm AS frontend-builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend source files (including pre-generated routes)
COPY resources ./resources
COPY public ./public
COPY vite.config.ts tsconfig.json ./

# Build frontend assets
# Skip Wayfinder regeneration - routes/actions are pre-generated and committed
ENV SKIP_WAYFINDER=1
RUN pnpm run build

# Stage 2: Final production image
FROM php:8.2-cli-alpine

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    curl

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_pgsql \
    pgsql \
    gd \
    mbstring \
    xml \
    bcmath \
    opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY --chown=www-data:www-data . .

# Copy built frontend assets from frontend-builder
COPY --from=frontend-builder --chown=www-data:www-data /app/public/build ./public/build

# Install PHP dependencies (production)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create storage and cache directories
RUN mkdir -p storage/framework/{cache,sessions,views} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Optimize for production (Laravel 12 comprehensive optimization)
RUN php artisan optimize \
    && php artisan event:cache

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

# Start Laravel's built-in server (Dokploy will use this)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
