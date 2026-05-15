FROM richarvey/nginx-php-fpm:latest

RUN docker-php-ext-install pdo pdo_pgsql

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80