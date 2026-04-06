#!/bin/bash
set -e
php-fpm -D
sleep 2
php /var/www/artisan migrate --force
nginx -g "daemon off;"