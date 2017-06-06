var likeArchiveApp = angular.module('likeArchive', ['ngSanitize']);

/**
* ==========
* APP CONFIG
* ==========
*
* Config module for allowing external asset loading from Tumblr. This is mainly to allow embedding of 
* audio and video urls given from the Tumblr API; these are external assets not provided by the API endpoints,
* so Angular will initially block such requests.
*
* @since 1.1.0
*/
likeArchiveApp.config(function($sceDelegateProvider){

	$sceDelegateProvider.resourceUrlWhitelist([

		'self',
		'http://*.tumblr.com/**',
		'https://*.tumblr.com/**',
		'https://www.youtube.com/**'
	]);

});

/**
* ==============
* APP CONTROLLER
* ==============
*
* Main controller module for the application
*
* @since 1.1.0
*/
likeArchiveApp.controller('UserSearch', function UserSearch(GetLikedPosts, PostConstructor, SourceFormatter, $scope, $http){

	//User to search
	$scope.user_to_get = "rubberninja";

	//Total posts manifest
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

		//Clear the view of all posts
		$("#error-message").css('display', 'none');
		$("#load-cell").fadeOut(1);

		$scope.thumbnails = [];

		//Grab the search query
		$scope.user_to_get = document.getElementById('user-search-input').value;

		//Execute generation of new user's liked posts
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

		//Parsing of liked posts data
		var likes = angular.fromJson(data).liked_posts;

		
		//Iterate through likes to construct thumbnails
		for(var i = 0; i < likes.length; i++){

			var individual_post = PostConstructor.buildPost(likes[i]);

			// If this is an audio post, we need to do some data reformatting
			if(likes[i].type === 'audio') likes[i] == SourceFormatter.reformatAudioSource(likes[i]);

			//Give IDs to thumbnails
			individual_post.ID = post_offset;
			post_offset++;

			//Push data to total manifest of posts
			$scope.all_post_data.push(likes[i]);

			$scope.thumbnails.push(individual_post);
		}

		$("#load-cell").fadeIn(1);
		
	}


	/**
	* newUserFailure
	* ==============
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
* POSTCONSTRUCTOR
* ===============
*
* Factory service for implementing the post thumbnail construction and other
* Post attributes required of the view template. There are certain attributes
* from the API call data that needs to be processed for better page performance,
* such as selecting a lower resolution image to display or reformatting a text post
* to display properly on a thumbnail.
*
* @since 1.1.0
*/
likeArchiveApp.factory('PostConstructor', function(){

	/**
	* textPost
	* ========
	*
	* Constructor function for a text post.
	*
	* @since 1.0.0
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var textPost = function(post, post_to_build){

		post_to_build.hasTitle = (post.title !== null) ? true : false;
		post_to_build.title = post.title;
		post_to_build.body = post.body;
		return post_to_build;
	};

	/**
	* 
	* photoPost
	* =========
	*
	* Builder function for photo posts.
	* Extracts appropriate JSON data
	* for producing the photo posts 
	* onto the view.
	*
	* @since 1.0.0
	* @param {JSON} post
	* @param {JSON} post_to_build
	* @return {JSON} post_to_build - {thumbnailURL}
	*/
	var photoPost = function(post, post_to_build){

		// Iterate through the array to find the appropriate-sized image.
		for(var i = 0; i < post.photos[0].alt_sizes.length; i++){
			if(post.photos[0].alt_sizes[i].width <= 250){
				post_to_build.thumbnail_url = post.photos[0].alt_sizes[i].url;
				break;
			}
		}

		// If not found, let's just use the original uploaded image (first image object in the array)
		if(!post_to_build.hasOwnProperty('thumbnail_url')) post_to_build.thumbnail_url = post.photos[0].alt_sizes[0].url;

		// Got all we need. Return the photo post JSON.
		return post_to_build;
	};

	/**
	* quotePost
	* =========
	*
	* Constructor function for a quote post.
	*
	* @since 1.0.0
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var quotePost = function(post, post_to_build){

		return post_to_build;			
	};

	/**
	* linkPost
	* ========
	*
	* Constructor function for a link post.
	*
	* @since 1.0.0
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var linkPost = function(post, post_to_build){

		return post_to_build;
	};

	/**
	* chatPost
	* ========
	*
	* Constructor function for a chat post.
	*
	* @since 1.0.0
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var chatPost = function(post, post_to_build){

		return post_to_build;
	};

	/**
	* audioPost
	* ========
	*
	* Constructor function for a audio post.
	*
	* @since 1.0.0
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var audioPost = function(post, post_to_build){

		post_to_build.title = post.track_name;
		post_to_build.subtitle = post.source_title;
		return post_to_build;
	};

	/**
	* videoPost
	* ========
	*
	* Constructor function for a video post.
	*
	* @since 1.0.0
	* @param {JSON} post - Retrieved post data
	* @param {JSON} post_to_build - The post we have to build
	*/
	var videoPost = function(post, post_to_build){

		post_to_build.thumbnail_url = post.thumbnail_url;
		return post_to_build;
	};

	/**
	* answerPost
	* ==========
	*
	* Constructs the JSON object for an answer post.
	*
	* @since 1.0.0
	* @param {JSON} post
	* @param {JSON} post_to_build
	* @return {JSON} post_to_build - {question: {asker, askerURL, question}, answer}
	*/
	var answerPost = function(post, post_to_build){

		post_to_build.question = {asker: post.asking_name,
			askerURL: post.asking_url,
			question: post.question};

		post_to_build.answer = post.answer;

		return post_to_build;
	};

	/**
	* buildPost
	* =========
	*
	* Main constructor function for building the post cell.
	* Determines the post type then executes the appropriate function
	* for each post.
	* 
	* @since 1.0.0
	* @param {JSON} post - Given post data
	*/
	var buildPost = function(post){
		// Final product JSON object for the post
		var built_post = {};

		// Setting up some known post object traits.
		built_post.reblogged_from = post.blog_name;

		// Need to create this attribute for Angular's ng-if to work properly
		built_post.type = post.type;

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


/**
* ==============
* AUDIOFORMATTER
* ==============
*
* Factory service to reformat audio post data to work with Angular.
* Audio source is an iframe, which cannot be rendered through data binding.
*
* @since 1.1.0
*/
likeArchiveApp.factory('SourceFormatter', function(){

	/**
	* redoIFrame
	* ==========
	*
	* Function serves to reformat the audio source data
	* From a given audio post. Because Tumblr's API restricts
	* direct access to the audio source url (for some reason),
	* This is a very hack-ish roundabout for that.
	*
	* @since 1.1.0
	*/
	var redoIFrame = function(somePost){

		// Create a dummy HTML element to hold the iframe
		var holder = document.createElement('html');
		holder.innerHTML = somePost.embed;

		// Grab the iframe src
		var source_url = holder.getElementsByTagName('iframe')[0].attributes.src.value;

		// Set it in the original post data and return
		somePost.new_audio_url = source_url;

		return somePost;

	};

	return {
		reformatAudioSource: function(somePost){
			return redoIFrame(somePost);
		}
	};

});


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