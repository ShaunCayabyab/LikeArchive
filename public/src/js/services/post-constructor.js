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
		if(!post_to_build.hasOwnProperty('thumbnail_url')) post_to_build.thumbnail_url = post.photos[0].alt_sizes[0].url;

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

		if(post.hasOwnProperty('source_url'))
			built_post.sourceURL = post.source_url;

		// Add the post trail to built_post
		built_post.trail = post.trail;

		return built_post;

	};

	return {

		buildPost: function(someData){
			return buildPost(someData);
		}

	};

});