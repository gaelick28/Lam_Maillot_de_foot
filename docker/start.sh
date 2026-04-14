#!/bin/bash
set -e

chown -R www-data:www-data /var/www/storage
chown -R www-data:www-data /var/www/bootstrap/cache
chmod -R 775 /var/www/storage
chmod -R 775 /var/www/bootstrap/cache

mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/storage/framework/cache
mkdir -p /var/www/storage/framework/sessions
chown -R www-data:www-data /var/www/storage
chmod -R 775 /var/www/storage

php-fpm -D
sleep 2
php /var/www/artisan config:clear
php /var/www/artisan config:cache
php /var/www/artisan view:cache
php /var/www/artisan storage:link
php -d max_execution_time=300 /var/www/artisan migrate --force
php /var/www/artisan queue:work --daemon --tries=3 &
nginx -g "daemon off;"