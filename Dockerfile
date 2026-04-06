FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    zip unzip nginx libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --optimize-autoloader --no-dev
RUN npm install && npm run build

RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

COPY docker/nginx/default.conf /etc/nginx/sites-available/default

EXPOSE 10000

COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]