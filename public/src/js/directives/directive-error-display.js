/**
* =======================
* ERROR MESSAGE DIRECTIVE
* =======================
*
*
*
* @since 1.1.0
*/
likeArchiveApp.directive('errorDisplay', function($log){

	return{
		restrict: 'AE',
		scope: {
			type: '=type'
		},
		template: "<div ng-include='getErrorMessage()'></div>",
		link: function(scope, element, attrs){

			scope.getErrorMessage = function(){
				var baseUrl = "../src/js/templates/errors/";
				var templateMap = {
					text: 'error-user.html'
		        };
		        var template = (templateMap[scope.type] !== undefined) ? baseUrl + templateMap[scope.type] : baseUrl + "error-none.html";

		        return template;
			}

			scope.$watch(scope.type, scope.getErrorMessage);
		}
	};
});