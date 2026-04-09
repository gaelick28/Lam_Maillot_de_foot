#!/bin/bash
set -e

mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/storage/framework/cache
mkdir -p /var/www/storage/framework/sessions

php-fpm -D
sleep 2
php /var/www/artisan config:clear
php /var/www/artisan config:cache
php /var/www/artisan view:cache
php /var/www/artisan storage:link
php -d max_execution_time=300 /var/www/artisan migrate --force
nginx -g "daemon off;"