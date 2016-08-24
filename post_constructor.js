//When the document is loaded, get the initial liked posts.
$(document).ready(function(){

	//Create the archival view of posts
	PostStorage.getPostsOnLoad();

	// Click event handler to popup individual post onto modal window
	$("#popup-container").click(function(){
		$("#popup-container").css('visibility', 'hidden');
		$("body").css('overflow', 'auto');
	});

	// Prevent modal window from closing when interacting with individual post
	$("#modal-box").click(function(event){
		event.stopPropagation();
	});

	// Enter key listener for submitting the inputted user in the search
	$('#input').keypress(function (e) {
	  if (e.which == 13) {
	    PostStorage.getNewUser($("#input").val());
	  }
	});
});


/**
* =========
* LOADPOSTS
* =========
* Executes that AJAX request to retrieve the next 
* liked posts. Then appends the generated posts list
* to the already existing ul in the view.
*/
function loadPosts(){
	// Visual jQuery to fade load-cell
	$("#load-cell").fadeOut(200);

	PostStorage.loadMorePosts();
}

function makePostModal(some_ID){
	PostStorage.retrievePost(some_ID);
}

/**
* ===================================================
*                       MODULES
* ===================================================
*/

/**
* ==================
* POSTSTORAGE MODULE
* ==================
* Module is responsible for the AJAX requests needed to retrieve posts,
* and to retrieve data to display an individual post.
* 
* @function executeAJAX()
* @function morePosts()
* @function getIndividualPost(post_id)
*/
var PostStorage = (function(){

	var user_to_get = "rubberninja";
	var all_post_data = [];

	var executeAJAX = function(given_date){
		// Handlebars.js template compiling
		var source = $("#list-template").html();
		var template = Handlebars.compile(source);

		//data object for AJAX request
		var post_data = {user: user_to_get,
						number: 50, 
						before: given_date};

		// AJAX request. calls tumblrclient.php,
		// sends data object post_data,
		// if success, construct the a JSON
		// of posts to render onto view.
		$.ajax({
			url: 'tumblrclient.php',
			type: 'POST',
			data: post_data,
			success: function(data){

				// If we can retrieve liked posts (forbidden or no user found),
				// catch error and display error message accordingly.
				try{
					JSON.parse(data);
				}
				catch(err){
					return error(err);
				}

				// Must remove load-cell from ul
				// so posts append can replace its position in the view.
				$("#load-cell").remove();

				// AJAX receives liked posts as JSON string,
				// this justs parses it back to JSON.
				var likes = JSON.parse(data).liked_posts;

				// The array of received liked posts to append
				// onto existing ul.
				var posts_to_return = {posts: []};
				var post_offset = all_post_data.length;

				//Iterate through each JSON post to construct posts_to_render.
				for(var i = 0; i < likes.length; i++){

					var individual_post = PostConstructor.buildPost(likes[i]);

					// Give each post object an ID for reference
					// when constructing the individual post modal box view.
					individual_post.ID = post_offset;
					post_offset++;

					// Add likes JSON object to the "global" storage
					all_post_data.push(likes[i]);

					// Add processed post object to the post list
					posts_to_return.posts.push(individual_post);
				}

				// All done! append this list of liked posts to existing list on view.
				$("#main-list").append(template(posts_to_return));
			}
		});
	};

	/**
	* morePosts
	* =========
	* Used to add more posts to the existing list.
	* Function grabs the timestamp from the last post on the list
	* and executes the AJAX request with the given timestamp.
	* This is to ensure that the appending will start off where
	* the posts lists ends.
	*/
	var morePosts = function(){
		var new_date = all_post_data[all_post_data.length - 1].liked_timestamp;
		executeAJAX(new_date);
	};


	/**
	* getIndividualPost
	* =================
	* Function to grab individual post data for the modal window view.
	* @param {int} post_id - The id data-set gotten from the chosen post-cell.
	*/
	var getIndividualPost = function(post_id){
		//return all_post_data[post_id];

		// Handlebars.js template compiling
		var source = $("#modal-box-template").html();
		var template = Handlebars.compile(source);

		var post = all_post_data[post_id];
		post.hasSource = (!post.hasOwnProperty("source_url") && !post.hasOwnProperty("source_title")) ? false : true;

		var modal_data = {};
		modal_data = post;
		modal_data.post_type = {isText: false, isPhoto: false, isQuote: false, isLink: false, isChat: false, isAudio: false, isVideo: false, isAnswer: false};

		if(post.type === "photo"){
			modal_data.post_type.isPhoto = true;
		}
		else if(post.type === "text"){
			modal_data.post_type.isText = true;
		}
		else if(post.type === "answer"){
			modal_data.post_type.isAnswer = true;
		}

		$("#modal-box").html(template(modal_data));
		$("#popup-container").css('visibility', 'visible');
		//$("#modal-box").css('visibility', 'visible');
		$("body").css('overflow', 'hidden');
	};


	/**
	* setNewUser
	* ==========
	* Used to grab the liked posts of a searched user.
	* Sets the user_to_get variable to the new user inputted
	* in the text input.
	* @param {String} some_input - The new user for grabbing liked posts
	*/
	var setNewUser = function(some_input){
		user_to_get = some_input;
		executeAJAX(Date.now() / 1000);
	}

	/**
	* error
	* =====
	* Displays the caught error message to the console.
	* @param {String} err - Caught error message 
	*/
	var error = function(err){
		console.log("error!: " + err);
		$("#error-message").css('display', 'block');
	};


	/*
	* PUBLIC FUNCTIONS TO RETURN
	* ==========================
	* @function retrievePost - To get an individual post
	* @function loadMorePosts - Loads more posts...
	* @function getPostsOnLoad - Initializes the post loading on start-up
	* @function getNewUser - Grabs the inputted new user on the nav form
	*/
	return{
		retrievePost:function(post_id){
			getIndividualPost(post_id);
		},
		loadMorePosts:function(){
			morePosts();
		},
		getPostsOnLoad: function(){
			executeAJAX(Date.now() / 1000);
		},
		getNewUser:function(some_input){
			$("#error-message").css('display', 'none');
			document.getElementById('main-list').innerHTML = '';
			setNewUser(some_input);
		}
	};

})();


/**
* ======================
* POSTCONSTRUCTOR MODULE
* ======================
* Module for constructing the JSON
* object for each post. Checks post type
* then executes the appropriate functions
* for producing the post JSON object.
*
* @function textPost(post, post_to_build)
* @function photoPost(post, post_to_build)
* @function quotePost(post, post_to_build)
* @function linkPost(post, post_to_build)
* @function chatPost(post, post_to_build)
* @function audioPost(post, post_to_build)
* @function videoPost(post, post_to_build)
* @function answerPost(post, post_to_build)
* @return {function} built_post
*/
var PostConstructor = (function(){

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

	/**
	* FUNCTION TO RETURN
	* ==================
	* @function buildPost
	*/
	return{
		buildPost:function(post){
			return buildPost(post);
		}
	};
})();

/**
* =======================
* MODALCONSTRUCTOR MODULE
* =======================
* Module used to create the modal window for an individual post
* 
*/
var ModalConstructor = (function(){

	return{
		buildModal:function(){

		}
	};
})();