<?php
	//PHP client autoload
	include( dirname( dirname(__FILE__) ) . '/vendor/autoload.php' );
	require_once( dirname( dirname(__FILE__) ) . '/secure/api_key.php' );

	// Authenticate via API Key
	$client = new Tumblr\API\Client($api_key);
	$search_query = json_decode( file_get_contents("php://input") );
	
	//Setting the limit variables for the GET request
	$limit = ( isset($search_query->number) ) ? $search_query->number : 25;
	$before = ( isset($search_query->before) ) ? $search_query->before : 0;
	$user = ( isset($search_query->user) ) ? $search_query->user . ".tumblr.com" : "tumblr.com";

	// Makes the request for getting the liked posts
	$getter = $client->getBlogLikes($user, array('limit' => $limit, 'before' => $before));

	//return JSON of liked posts retrieved from GET request
	echo json_encode($getter);
?>