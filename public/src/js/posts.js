var likeArchiveApp = angular.module('likeArchive' []);

likeArchiveApp.controller('userSearch', function userSearch($scope, $http){

	$scope.user_to_get = "rubberninja";
	$scope.all_post_data = [];


	$scope.getUserLikes = function(){

		GetLikedPosts.getLikes($scope.user_to_get, Date.now() / 1000, newUserSuccess, newUserFailure);

	};


	$scope.getMoreLikes = function(){

		var new_date = $scope.all_post_data[$scope.all_post_data.length - 1].liked_timestamp;

		GetLikedPosts.getLikes($scope.user_to_get, new_date, moreLikesSuccess, moreLikesFailure);

	}


	newUserSuccess = function(data){

		var posts_to_return = {posts: []};
		var post_offset = all_post_data.length;

		console.log(data);

		/*
		for(var i = 0; i < data.length; i++){

			var individual_post = PostConstructor.buildPost(data[i]);

		}
		*/
	}

	newUserFailure = function(data){

		console.log(data);

	}


	moreLikesSuccess = function(data){

	}

	moreLikesFailure = function(data){

	}

});



likeArchiveApp.factory('GetLikedPosts', function($http){

	this.post_data = {
		user: '',
		number: 50,
		before: 0
	};

	return {

		getLikes: function(user, date, onSuccess, onFailure){

			this.post_data.user = user;
			this.post_data.before = date;


			$http({
				method: 'POST',
				url: '../public/php/tumblrclient.php',
				data: post_data,
			})
			.success(onSuccess)
			.error(onFailure);

		};
	}

});



likeArchiveApp.provider('GetMorePosts', function(last_post_timestamp){

});



likeArchiveApp.factory('PostConstructor', function(){

});