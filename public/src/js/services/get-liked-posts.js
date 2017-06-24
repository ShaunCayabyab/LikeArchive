/**
* =============
* GETLIKEDPOSTS
* =============
*
* Factory service to execute the http request. The http request
* references the PHP file responsible for executing the API call
* via Tumblr PHP client. The PHP file then returns the retrieved
* data to this factorice service, which will then execute the proper
* functions upon success or failure.
*
* @since 1.1.0
*/
likeArchiveApp.factory('GetLikedPosts', function($http){

	//Functions to return
	return {

		/**
		* getLikes
		* ========
		*
		* For executing the API request
		*
		* @since 1.1.0
		* @param user        The given username
		* @param date        The given timestamp to find posts before
		* @param onSuccess   The success callback function
		* @param onFailure   The failure callback function
		*/
		getLikes: function(user, date, onSuccess, onFailure){

			$http({
				method: 'POST',
				url: '../php/search.php',
				data: {user: user, number: 50, before: date}
			})
			.success(onSuccess)
			.error(onFailure);

		}
	}

});