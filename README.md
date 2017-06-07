# LikeArchive
An Archival view of a Tumblr User's Liked Posts

## ABOUT
This is a single page application that uses the Tumblr API and PHP client to create an archival view of a Tumblr user's liked posts. Properly viewing your liked posts or another user's publicly shared liked posts has always been a problem of mine during my times of using Tumblr, and I wanted to remedy that with this application.

Within the application, users can view the liked posts of theirs, or of a Tumblr user they wish to choose, similar to how the archive section of someone's Tumblr page is set up. Individual liked posts can also be viewed within the application in a format similar to what a typical Tumblr post would look like.

![LikeArchive UI 01](http://i.imgur.com/cSrW3H7.png "LikeArchive UI")
![LikeArchive UI 02](http://i.imgur.com/RAt7tjR.png "LikeArchive UI")

## DEPENDENCIES
- [tumblr.php](https://github.com/tumblr/tumblr.php) - (latest)
- jQuery - (2.2.4)
- [AngularJS](https://angularjs.org/) - (1.5.6)

## DEVELOPMENT SETUP

```
git clone git@github.com:ShaunCayabyab/LikeArchive.git
cd src
composer install
cd ..
docker-compose up -d
```
Then `open http://$(docker-machine ip):8080` or `localhost:8080`

## UPDATES
- `05/25/2017` => Picked this project back up again, and man it needed improving! Converted to use AngularJS for front-end functionality.
- `08/23/2016` => Added a feature to search for users and display their liked posts, if made public. Also added a display for text posts.
- `08/21/2016` => Initial commit, yay! Application currently can only view a single blog's liked posts. Looking into implementing a feature to view liked posts within a certain month.