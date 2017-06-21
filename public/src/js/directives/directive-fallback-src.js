/**
* ======================
* FALLBACK SRC DIRECTIVE
* ======================
*
* The directive for using a fallback source for elements.
* Sometimes with certain template modules, ng-src doesn't
* render the data-bindings before the markup renders, resulting
* in 404 errors to pop up in the console for images, audio files,
* and video files. This directive is a way to create a fallback src for
* these elements, so the 404 doesn't output to the console. As of right now,
* The fallback-src doesn't seem to work for the video template module.
*
* @since 1.1.0
*/
likeArchiveApp.directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
   }
   return fallbackSrc;
});