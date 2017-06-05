FROM php:5-apache

RUN a2enmod rewrite

RUN apt-get update && apt-get install -y mysql-client libmysqlclient-dev \ 
      && docker-php-ext-install mysqli

RUN rm -rf /usr/local/etc/php/conf.d/opcache-recommended.ini
RUN rm -rf /usr/local/etc/php/conf.d/opcache.ini

COPY config/ /usr/local/etc/php/
COPY public/ /var/www/html/

EXPOSE 80