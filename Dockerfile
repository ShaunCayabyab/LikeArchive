FROM php:5.6-apache

ADD config/ /usr/local/etc/php/
ADD secure/ /var/
ADD src/ /var/www/html/

RUN a2enmod rewrite

RUN service apache2 restart

EXPOSE 80