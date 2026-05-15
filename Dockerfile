FROM richarvey/nginx-php-fpm:latest

# Instalează dependințele pentru PostgreSQL + extensia PHP
RUN apk --no-cache add postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copiază proiectul
COPY . /var/www/html

# Permisiuni corecte
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80