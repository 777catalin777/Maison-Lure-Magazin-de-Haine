FROM richarvey/nginx-php-fpm:2.2.0

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html

 RUN composer install --no-dev --optimize-autoloader

EXPOSE 80