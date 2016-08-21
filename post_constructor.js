// Access to post objects already obtained
var GLOBAL_POST_STORAGE = [];

//When the document is loaded, get the initial liked posts.
$(document).ready(function(){

	// Handlebars.js template compiling
	var source = $("#list-template").html();
	var template = Handlebars.compile(source);

	//data object for AJAX request
	var post_data = {number: 50, 
					 offset: 0};

	// AJAX request. calls tumblrclient.php,
	// sends data object post_data,
	// if success, construct the a JSON
	// of posts to render onto view.
	$.ajax({
		url: 'tumblrclient.php',
		type: 'POST',
		data: post_data,
		success: function(data){
			// AJAX receives liked posts as JSON string,
			// this justs parses it back to JSON.
			var likes = JSON.parse(data).liked_posts;

			// The array of received liked posts to append
			// onto existing ul.
			var posts_to_return = {posts: []};
			var post_offset = 0;

			//Iterate through each JSON post to construct posts_to_render.
			for(var i = 0; i < likes.length; i++){
				var individual_post = postConstructor(likes[i]);

				// Give each post object an ID for reference
				// when constructing the individual post modal box view.
				individual_post.ID = post_offset;
				post_offset++;
				GLOBAL_POST_STORAGE.push(likes[i]);

				posts_to_return.posts.push(individual_post);
	

			}

			// All done! append this list of liked posts to existing list on view.
			$("#main-list").append(template(posts_to_return));
		}
	});

	// Click event handler to popup individual post onto modal window
	$("#popup-container").click(function(){
		$("#popup-container").css('visibility', 'hidden');
		$("body").css('overflow', 'auto');
	});

	//Prevent modal window from closing when interacting with individual post
	$("#modal-box").click(function(event){
		event.stopPropagation();
	});
});


/**
* =========
* LOADPOSTS
* =========
* Exectutes that AJAX request to retrieve the next 
* liked posts. Then appends the generated posts list
* to the already existing ul in the view.
*/
function loadPosts(){
	// Get the dataset of the last post-cell in the view list
	var currentCells = document.getElementsByClassName("post-cell");
	var post_offset = parseInt(currentCells[currentCells.length - 2].dataset.cell) + 1;

	// Handlebars.js template compiling
	var source = $("#list-template").html();
	var template = Handlebars.compile(source);

	// Acts as a pointer to continue GET from where we left off.
	var post_data = {number: 50, offset: post_offset};

	// Visual jQuery to fade load-cell
	$("#load-cell").fadeOut(200);

	// AJAX request for lked posts.
	$.ajax({
		url: 'tumblrclient.php',
		type: 'POST',
		data: post_data,
		success: function(data){
			// Must remove load-cell from ul
			// so posts append can replace its position in the view.
			$("#load-cell").remove();

			// Same execution as initial AJAX request on load.
			var likes = JSON.parse(data).liked_posts;

			var posts_to_return = {posts: []};

			for(var i = 0; i < likes.length; i++){
				var individual_post = postConstructor(likes[i]);

				// Give each post object an ID for reference
				// when constructing the individual post modal box view.
				individual_post.ID = post_offset;
				post_offset++;
				GLOBAL_POST_STORAGE.push(likes[i]);

				posts_to_return.posts.push(individual_post);
			}

			$("#main-list").append(template(posts_to_return));
		}
	});
}

/**
* ===============
* POSTCONSTRUCTOR
* ===============
* Main function for constructing the JSON
* object for each post. Checks post type
* then executes the appropriate functions
* for producing the post JSON object.
*
* @param {JSON} post
* @return {JSON} built_post
*/
function postConstructor(post){
	// Final product JSON object for the post
	var built_post = {};

	// Setting up some known post object traits.
	built_post.reblogged_from = post.blog_name;
	built_post.type = {isText: false,
					isPhoto: false,
					isQuote: false,
					isLink: false,
					isChat: false,
					isAudio: false,
					isVideo: false,
					isAnswer: false};

	// Find out the post type, then execute appropriate functions
	if(post.type === "photo"){
		built_post.type.isPhoto = true;
		built_post = buildPhotoPost(post, built_post);
	}
	else if(post.type === "text"){
		built_post.type.isText = true;
		built_post = buildTextPost(post, built_post);
	}
	else if(post.type === "answer"){
		built_post.type.isAnswer = true;
		built_post = buildAnswerPost(post, built_post);
	}


	// Add the reblog and source URLS to the JSON
	built_post.reblogURL = post.post_url;

	// Some posts don't have a source_url, so let's check for that.
	if(post.hasOwnProperty('source_url'))
		built_post.sourceURL = post.source_url;

	built_post.trail = post.trail;

	// Post JSON all built! Time to return it.
	return built_post;
}

/**
* ==============
* BUILDPHOTOPOST
* ==============
* Builder function for photo posts.
* Extracts appropriate JSON data
* for producing the photo posts 
* onto the view.
*
* @param {JSON} post
* @param {JSON} post_to_build
* @return {JSON} post_to_build - {photoURL}
*/
function buildPhotoPost(post, post_to_build){

	// Obtain the array of photo objects from the post
	var thumb_photo = post.photos[0].alt_sizes[0];

	// Iterate through the array to find the appropriate-sized image.
	for(var i = 0; i < post.photos[0].alt_sizes.length; i++){
		if(post.photos[0].alt_sizes[i].width === 250) post_to_build.photoURL = post.photos[0].alt_sizes[i].url;
	}

	// If not found, let's just use the original uploaded image (first image object in the array)
	if(!post_to_build.hasOwnProperty('photoURL')) post_to_build.photoURL = post.photos[0].alt_sizes[0].url;

	// Got all we need. Return the photo post JSON.
	return post_to_build;
}


function buildTextPost(post, post_to_build){
	return post_to_build;
}


/**
* 
*
* @param {JSON} post
* @param {JSON} post_to_build
* @return {JSON} post_to_build - {question: {asker, askerURL, question}, answer}
*/
function buildAnswerPost(post, post_to_build){

	post_to_build.question = {asker: post.asking_name,
					askerURL: post.asking_url,
					question: post.question};

	post_to_build.answer = post.answer;

	return post_to_build;
}



function makePostModal(some_ID){

	// Handlebars.js template compiling
	var source = $("#modal-box-template").html();
	var template = Handlebars.compile(source);

	var post = GLOBAL_POST_STORAGE[some_ID];
	post.hasSource = (!post.hasOwnProperty("source_url") && !post.hasOwnProperty("source_title")) ? false : true;


	var modal_data = {};
	modal_data = post;
	modal_data.post_type = {isText: false,
							isPhoto: false,
							isQuote: false,
							isLink: false,
							isChat: false,
							isAudio: false,
							isVideo: false,
							isAnswer: false};

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
}