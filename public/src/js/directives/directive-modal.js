/**
* ======================
* MODAL WINDOW DIRECTIVE
* ======================
*
* Directive for the modal window used to diplay an individual post.
* Directive uses a base template to display the general information
* (i.e. notes, source name, etc.), which uses other template modules
* depending on the type of post being displayed.
*
* @since 1.1.0
*/
likeArchiveApp.directive('modalWindow', function(){

	return{
		restrict: 'AE',
		scope: false,
		templateUrl: '../src/js/templates/modal/base.html',
		link: function(scope, element, attrs){

			var post_type = "";

			scope.getTemplate = function(somePostType){
				post_type = (somePostType !== undefined) ? somePostType : "text";

				var baseUrl = "../src/js/templates/modal/";
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
		        return ( baseUrl + templateMap[post_type] ) || "../src/js/templates/template-modal.html" ;
			}
		}
	};
});