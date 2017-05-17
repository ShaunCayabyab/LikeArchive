# LikeArchive
An Archival view of a Tumblr User's Liked Posts

## ABOUT
This is a single page application that uses the Tumblr API and PHP client to create an archival view of a Tumblr user's liked posts. Properly viewing your liked posts or another user's publicly shared liked posts has always been a problem of mine during my times of using Tumblr, and I wanted to remedy that with this application.

Within the application, users can view the liked posts of theirs, or of a Tumblr user they wish to choose, similar to how the archive section of someone's Tumblr page is set up. Individual liked posts can also be viewed within the application in a format similar to what a typical Tumblr post would look like.

## FILES
### tumblrclient.php
Initializer for the Tumblr PHP client, and main file for the HTTP GET requests for liked posts.

### post_constructor.js
Controller for the LikeArchive view. Performs AJAX requests with `tumblrclient.php` to retrieve certain liked posts, then formats each post objects to be displayed on to the view `index.php`

### index.php
Main view for the LikeArchive application. Produces the archival view of liked posts, and a modal window do display an individual post selected by the app user. Makes use of Handlebars.js for HTML templating.

## DEPENDENCIES
- [tumblr.php](https://github.com/tumblr/tumblr.php) => the Tumblr API client for PHP
- jQuery => used for AJAX requests and certain DOM manipulation
- [Handlebars.js](http://handlebarsjs.com/) => Javascript templating engine used to generate the list of liked posts

## SETUP

```
git clone git@github.com:ShaunCayabyab/LikeArchive.git
cd src
composer install
cd ..
docker-compose up -d
```
Then `open http://$(docker-machine ip):8282` or `localhost:8282`

## UPDATES
- `08/23/2016` => Added a feature to search for users and display their liked posts, if made public. Also added a display for text posts.
- `08/21/2016` => Initial commit, yay! Application currently can only view a single blog's liked posts. Looking into implementing a feature to view liked posts within a certain month.