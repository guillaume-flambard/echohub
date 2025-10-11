# EchoHub Production Dockerfile - OPTIMIZED FOR AWS FREE TIER
# Fast builds using pre-compiled PHP extensions
# Last updated: 2025-10-11

# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy frontend source files
COPY resources ./resources
COPY public ./public
COPY vite.config.ts tsconfig.json ./

# Build frontend assets
ENV SKIP_WAYFINDER=1
RUN pnpm run build

# Stage 2: Final production image using pre-built PHP with extensions
FROM thecodingmachine/php:8.3-v4-cli

# Switch to root for installations
USER root

WORKDIR /var/www/html

# Install system dependencies (minimal)
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions are already included in thecodingmachine/php:
# - pdo_pgsql, pgsql (database)
# - gd (image processing)
# - mbstring, xml (string/XML handling)
# - bcmath (math)
# - opcache (performance)
# No compilation needed!

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY --chown=docker:docker . .

# Copy built frontend assets from frontend-builder
COPY --from=frontend-builder --chown=docker:docker /app/public/build ./public/build

# Install PHP dependencies (production)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create storage and cache directories
RUN mkdir -p storage/framework/{cache,sessions,views} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && mkdir -p database \
    && touch database/database.sqlite \
    && chown -R docker:docker storage bootstrap/cache database

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/up || exit 1

# Create startup script
RUN echo '#!/bin/bash' > /start.sh \
    && echo 'set -e' >> /start.sh \
    && echo 'echo "Clearing cached config..."' >> /start.sh \
    && echo 'rm -f bootstrap/cache/config.php' >> /start.sh \
    && echo 'echo "Optimizing with runtime environment..."' >> /start.sh \
    && echo 'php artisan optimize' >> /start.sh \
    && echo 'php artisan event:cache' >> /start.sh \
    && echo 'echo "Running database migrations..."' >> /start.sh \
    && echo 'php artisan migrate --force --no-interaction' >> /start.sh \
    && echo 'echo "Seeding database..."' >> /start.sh \
    && echo 'php artisan db:seed --force --class=DatabaseSeeder' >> /start.sh \
    && echo 'echo "Starting server..."' >> /start.sh \
    && echo 'exec php artisan serve --host=0.0.0.0 --port=8000' >> /start.sh \
    && chmod +x /start.sh \
    && chown docker:docker /start.sh

# Switch back to non-root user
USER docker

# Start with optimization script
CMD ["/start.sh"]
