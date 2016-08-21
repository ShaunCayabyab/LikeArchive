<?php
	//PHP client autoload
	include('vendor/autoload.php');

	// Authenticate via API Key
	$client = new Tumblr\API\Client('xnB7d27VGuKmr8VsR0u8ujzrCh4TgIF3MwpTAZmHCIqjdBth0m');

	//Setting the limit variables for the GET request
	if(isset($_POST['number'])){
		$limit = $_POST['number'];
	}
	else{
		$limit = 25;
	}

	if(isset($_POST['offset'])){
		$offset = $_POST['offset'];
	}
	else{
		$offset = 0;
	}

	// Makes the request for getting the liked posts
	$getter = $client->getBlogLikes('[TUMBLR USER]', array('limit' => $limit, 'offset' => $offset));

	//return JSON of liked posts retrieved from GET request
	echo json_encode($getter);
?>