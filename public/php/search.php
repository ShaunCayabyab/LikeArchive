<?php
	//PHP client autoload
	include( dirname( dirname(__FILE__) ) . '/vendor/autoload.php' );

	//Secured API Key (not for you!)
	require_once( dirname( dirname(__FILE__) ) . '/secure/api_key.php' );

	// Authenticate via API Key
	$client = new Tumblr\API\Client($api_key);


	$search_query = json_decode( file_get_contents("php://input") );
	
	//Setting the limit variables for the GET request
	if( isset($search_query->number) ){
		$limit = $search_query->number;
	}
	else{
		$limit = 25;
	}

	if( isset($search_query->before) ){
		$before = $search_query->before;
	}
	else{
		$before = 0;
	}

	if( isset($search_query->user) ){
		$user = $search_query->user . ".tumblr.com";
	}
	else{
		$user = "tumblr.com";
	}

	



	// Makes the request for getting the liked posts
	$getter = $client->getBlogLikes($user, array('limit' => $limit, 'before' => $before));

	//return JSON of liked posts retrieved from GET request
	echo json_encode($getter);
?>