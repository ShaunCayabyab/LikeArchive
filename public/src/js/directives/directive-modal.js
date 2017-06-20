likeArchiveApp.directive('modalWindow', function(){

	return{
		restrict: 'AE',
		scope: false,
		templateUrl: '../public/src/js/templates/modal/base.html',
		link: function(scope, element, attrs){

			//var post_type = (scope.modal_post !== undefined) ? scope.modal_post.post_type : "";
			var post_type = "";

			scope.getTemplate = function(somePostType){
				post_type = (somePostType !== undefined) ? somePostType : "text";

				var baseUrl = "../public/src/js/templates/modal/";
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
		        return ( baseUrl + templateMap[post_type] ) || "../public/src/js/templates/template-modal.html" ;
			}
		}
	};
});