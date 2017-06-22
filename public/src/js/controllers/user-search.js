/**
* ==========
* USERSEARCH
* ==========
*
* Main controller module for the application
*
* @since 1.1.0
*/
likeArchiveApp.controller('UserSearch', function UserSearch(GetLikedPosts, PostConstructor, SourceFormatter, $scope, $http, $log){

	var user_search = this;
	user_search.getMoreLikes = $scope.getMoreLikes;
	user_search.individualPost = $scope.individualPost;

	$scope.user_to_get = "rubberninja";
	$scope.all_post_data = [];
	$scope.thumbnails = [];
	$scope.modal_post;



	/**
	* getUserLikes
	* ============
	*
	* Function to get a new user's liked posts
	*
	* @since 1.1.0
	*/
	$scope.getUserLikes = function(){

		$scope.all_post_data = [];
		$scope.thumbnails = [];

		//Clear the view of all posts and errors
		$("#error-message").css('display', 'none');
		$("#load-cell").fadeOut(1);
		angular.element(document.querySelector('#error')).attr('type', '');

		//Grab the search query
		$scope.user_to_get = document.getElementById('user-search-input').value;
		GetLikedPosts.getLikes($scope.user_to_get, Date.now() / 1000, onSuccess, onFailure);

	};


	/**
	* getMoreLikes
	* ============
	*
	* Function to load more of a user's liked posts
	*
	* @since 1.1.0
	*/
	$scope.getMoreLikes = function(){

		var new_date = $scope.all_post_data[$scope.all_post_data.length - 1].liked_timestamp;

		//Get rid of load cell and start post loading
		$("#load-cell").fadeOut(200);
		GetLikedPosts.getLikes($scope.user_to_get, new_date, onSuccess, onFailure);

	};


	/**
	* individualPost
	* ==============
	*
	* Used to grab data from an individual liked post
	* and display it on the modal window.
	*
	* @since 1.1.0
	* @param someID    The given ID for the selected post
	*/
	$scope.individualPost = function(someID){

		//Preparing the data for modal display
		var post = $scope.all_post_data[someID];
		post.hasSource = (!post.hasOwnProperty("source_url") && !post.hasOwnProperty("source_title")) ? false : true;

		$scope.modal_post = {};
		$scope.modal_post = post;
		$scope.modal_post.post_type = $scope.thumbnails[someID].type;

		$("#popup-container").css('visibility', 'visible');
		$("body").css('overflow', 'hidden');

	};


	/**
	* clearModal
	* ==========
	*
	* For the purpose of clearing data from the modal template
	* some previously viewed post is no longer visible.
	*
	* @since 1.1.0
	*/
	$scope.clearModal = function(){

		$scope.modal_post = {};
		$("#popup-container").css('visibility', 'hidden');
		$("body").css('overflow', 'auto');

	}


	/**
	* onSuccess
	* =========
	*
	* Function invoked when API request is successful
	*
	* @since 1.1.0
	* @param data    The retrieved data from the successful API call
	*/
	onSuccess = function(data){

		var post_offset = $scope.all_post_data.length;

		try{
			var likes = angular.fromJson(data).liked_posts;
			iterate();
		}
		catch(err){
			$log.warn("Oops! It seems that this user doesn't exist, or that this user has their likes set to private.");
			angular.element(document.querySelector('#error')).attr('type', 'user');
		}
		
		//Function for iterating upon success
		function iterate(){

			for(var i = 0; i < likes.length; i++){

				var individual_post = PostConstructor.buildPost(likes[i]);
				if(likes[i].type === 'audio') likes[i] == SourceFormatter.reformatAudioSource(likes[i]);
			
				individual_post.ID = post_offset;
				post_offset++;

				$scope.all_post_data.push(likes[i]);
				$scope.thumbnails.push(individual_post);
			}

			$("#load-cell").fadeIn(1);
		}
	}


	/**
	* onFailure
	* =========
	*
	* Function invoked when API request fails
	*
	* @since 1.1.0
	* @param data    Data sent from failed API call
	*/
	onFailure = function(data){

		console.log(data);

	}

});