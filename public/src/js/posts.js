var likeArchiveApp = angular.module('likeArchive', ['ngSanitize']);

likeArchiveApp.controller('UserSearch', function UserSearch(GetLikedPosts, PostConstructor, $scope, $http){

	//User to search
	$scope.user_to_get = "rubberninja";

	//Total posts manifest
	$scope.all_post_data = [];
	$scope.thumbnails = [];



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

		//Clear the view of all posts
		$("#error-message").css('display', 'none');
		$("#load-cell").fadeOut(1);

		$scope.thumbnails = [];

		//Grab the search query
		$scope.user_to_get = document.getElementById('user-search-input').value;

		//Execute generation of new user's liked posts
		GetLikedPosts.getLikes($scope.user_to_get, Date.now() / 1000, newUserSuccess, newUserFailure);

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

		GetLikedPosts.getLikes($scope.user_to_get, new_date, moreLikesSuccess, moreLikesFailure);

	}


	/**
	* newUserSuccess
	* ==============
	*
	* Function invoked when getNewUser is successful
	*
	* @since 1.1.0
	*/
	newUserSuccess = function(data){

		//Array of received liked posts to append onto list
		var posts_to_return = {posts: []};
		var post_offset = $scope.all_post_data.length;

		//Parsing of liked posts data
		var likes = angular.fromJson(data).liked_posts;

		//Remove the load-cell if need be
		//$('#load-cell').remove();

		
		//Iterate through likes to construct thumbnails
		for(var i = 0; i < likes.length; i++){

			var individual_post = PostConstructor.buildPost(likes[i]);

			//Give IDs to thumbnails
			individual_post.ID = post_offset;
			post_offset++;

			//Push data to total manifest of posts
			$scope.all_post_data.push(likes[i]);

			//Push generated post to post list
			posts_to_return.posts.push(individual_post);

			$scope.thumbnails.push(individual_post);
		}

		$("#load-cell").fadeIn(1);
		
	}


	/**
	* newUserFailure
	* ==============
	*
	* Function invoked when getNewUser fails
	*
	* @since 1.1.0
	*/
	newUserFailure = function(data){

		console.log(data);

	}


	/**
	* moreLikesSuccess
	* ================
	*
	* Function invoked when getMoreLikes is successful
	*
	* @since 1.1.0
	*/
	moreLikesSuccess = function(data){

	}


	/**
	* moreLikesFailure
	* ================
	*
	* Function invoked when getMoreLikes fails
	*
	* @since 1.1.0
	*/
	moreLikesFailure = function(data){

	}

});


/**
* =============
* GetLikedPosts
* =============
*
* Factory service to execute the http request
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
				url: '../public/php/search.php',
				data: {user: user, number: 50, before: date}
			})
			.success(onSuccess)
			.error(onFailure);

		}
	}

});



/**
* ===============
* PostConstructor
* ===============
*
* Factory service for implementing the post thumbnail construction
*
* @since 1.1.0
*/
likeArchiveApp.factory('PostConstructor', function(){

	/**
	* textPost
	* ========
	* Constructor function for a text post.
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var textPost = function(post, post_to_build){
		post_to_build.type.isText = true;
		post_to_build.type.hasTitle = (post.title !== null) ? true : false;
		post_to_build.title = post.title;
		post_to_build.body = post.body;
		return post_to_build;
	};

	/**
	* 
	* photoPost
	* =========
	* Builder function for photo posts.
	* Extracts appropriate JSON data
	* for producing the photo posts 
	* onto the view.
	*
	* @param {JSON} post
	* @param {JSON} post_to_build
	* @return {JSON} post_to_build - {photoURL}
	*/
	var photoPost = function(post, post_to_build){

		post_to_build.type.isPhoto = true;

		// Iterate through the array to find the appropriate-sized image.
		for(var i = 0; i < post.photos[0].alt_sizes.length; i++){
			if(post.photos[0].alt_sizes[i].width === 250) post_to_build.photoURL = post.photos[0].alt_sizes[i].url;
		}

		// If not found, let's just use the original uploaded image (first image object in the array)
		if(!post_to_build.hasOwnProperty('photoURL')) post_to_build.photoURL = post.photos[0].alt_sizes[0].url;

		// Got all we need. Return the photo post JSON.
		return post_to_build;
	};

	/**
	* quotePost
	* ========
	* Constructor function for a quote post.
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var quotePost = function(post, post_to_build){
		post_to_build.type.isQuote = true;
		return post_to_build;			
	};

	/**
	* linkPost
	* ========
	* Constructor function for a link post.
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var linkPost = function(post, post_to_build){
		post_to_build.type.isLink = true;
		return post_to_build;
	};

	/**
	* chatPost
	* ========
	* Constructor function for a chat post.
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var chatPost = function(post, post_to_build){
		post_to_build.type.isChat = true;
		return post_to_build;
	};

	/**
	* audioPost
	* ========
	* Constructor function for a audio post.
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var audioPost = function(post, post_to_build){
		post_to_build.type.isAudio = true;
		return post_to_build;
	};

	/**
	* videoPost
	* ========
	* Constructor function for a video post.
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var videoPost = function(post, post_to_build){
		post_to_build.type.isVideo = true;
		return post_to_build;
	};

	/**
	* answerPost
	* ==========
	* Constructs the JSON object for an answer post.
	*
	* @param {JSON} post
	* @param {JSON} post_to_build
	* @return {JSON} post_to_build - {question: {asker, askerURL, question}, answer}
	*/
	var answerPost = function(post, post_to_build){
		post_to_build.type.isAnswer = true;

		post_to_build.question = {asker: post.asking_name,
			askerURL: post.asking_url,
			question: post.question};

		post_to_build.answer = post.answer;

		return post_to_build;
	};

	/**
	* buildPost
	* =========
	* Main constructor function for building the post cell.
	* Determines the post type then executes the appropriate function
	* for each post.
	* @param {JSON} post - Given post data
	*/
	var buildPost = function(post){
		// Final product JSON object for the post
		var built_post = {};

		// Setting up some known post object traits.
		built_post.reblogged_from = post.blog_name;
		built_post.type = {isText: false, isPhoto: false, isQuote: false, isLink: false, isChat: false, isAudio: false, isVideo: false, isAnswer: false};

		// Switch cases for proper post type function routing.
		switch(post.type){
			case "text":
				built_post = textPost(post, built_post);
				break;
			case "photo":
				built_post = photoPost(post, built_post);
				break;
			case "quote":
				built_post = quotePost(post, built_post);
				break;
			case "link":
				built_post = linkPost(post, built_post);
				break;
			case "chat":
				built_post = chatPost(post, built_post);
				break;
			case "audio":
				built_post = audioPost(post, built_post);
				break;
			case "video":
				built_post = videoPost(post, built_post);
				break;
			case "answer":
				built_post = answerPost(post, built_post);
				break;
		}

		// Add the reblog and source URLS to the JSON
		built_post.reblogURL = post.post_url;

		// Some posts don't have a source_url, so let's check for that.
		if(post.hasOwnProperty('source_url'))
			built_post.sourceURL = post.source_url;

		// Add the post trail to built_post
		built_post.trail = post.trail;

		// Return constructed post
		return built_post;

	};

	return {

		buildPost: function(someData){
			return buildPost(someData);
		}

	};

});