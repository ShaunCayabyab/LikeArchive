//The start of it all
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