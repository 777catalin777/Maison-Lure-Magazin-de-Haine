FROM richarvey/nginx-php-fpm:latest

# Copiază tot codul proiectului
COPY . /var/www/html

# Permisiuni corecte
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Dacă ai nevoie de extensii PHP suplimentare (ex: mysqli, gd, etc.)
# RUN docker-php-ext-install mysqli pdo pdo_mysql

EXPOSE 80