/**
* ==============
* TRUSTED FILTER
* ==============
*
* Filter for allowing YouTube videos to be framed on the iframe. Because of cross-
* origin restrictions, Angular needs to know that the video link should be trusted.
* Filter is applied during the data binding on the template.
*
* @since 1.1.0
*/
likeArchiveApp.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
            var video_id = url.split('v=')[1].split('&')[0];
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + video_id);
    };
}]);