/**
* =======================
* POST THUMBNAIL DIRECTIVE
* =======================
*
* Directive file for the post thumbnail templates. Directive can dynamically load
* templates based on the post type (i.e text posts load text template, photo posts load
* photo template, etc.).
*
* @since 1.1.0
*/
likeArchiveApp.directive('postThumbnail', function(){

	return{
		restrict: 'AE',
		scope: {
			post: '=data'
		},
		template: "<div ng-include='getTemplate()'></div>",
		link: function(scope, element, attrs){

			scope.getTemplate = function(){
				var baseUrl = "../src/js/templates/thumbnails/";
				var templateMap = {
					text: 'text.html',
		            photo: 'photo.html',
		            video: 'video.html',
		            quote: 'quote.html',
		            link: 'link.html',
		            chat: 'chat.html',
		            audio: 'audio.html',
		            answer: 'answer.html'
		        };

		        //Use a fallback just in case post type returns undefined
		        return ( baseUrl + templateMap[scope.post.type] ) || "../src/js/templates/template-thumbnails.html" ;
			}
		}
	};
});