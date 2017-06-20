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

		// Grab the iframe src and return
		holder.innerHTML = somePost.embed;
		var source_url = holder.getElementsByTagName('iframe')[0].attributes.src.value;
		somePost.new_audio_url = source_url;

		return somePost;

	};

	return {
		reformatAudioSource: function(somePost){
			return redoIFrame(somePost);
		}
	};

});