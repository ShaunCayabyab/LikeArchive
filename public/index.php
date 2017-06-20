<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name=viewport content="width=device-width, initial-scale=1" />
		<!--jQuery library-->
		<script
			  src="https://code.jquery.com/jquery-2.2.4.min.js"
			  integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
			  crossorigin="anonymous"></script>
		<!--AngularJS dependencies-->
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.js"></script>
		<script src="https://code.angularjs.org/1.5.6/angular-sanitize.min.js"></script>
		<!--App file-->
		<script type="text/javascript" src="src/js/posts.js"></script>
		<script type="text/javascript" src="src/js/directives/directive-thumbnails.js"></script>
		<script type="text/javascript" src="src/js/directives/directive-modal.js"></script>
		<script type="text/javascript" src="src/js/services/get-liked-posts.js"></script>
		<script type="text/javascript" src="src/js/services/post-constructor.js"></script>
		<script type="text/javascript" src="src/js/services/source-formatter.js"></script>
		<script type="text/javascript" src="src/js/filters/trusted-filter.js"></script>
		<script type="text/javascript" src="src/js/controllers/user-search.js"></script>
		<script type="text/javascript">
			$(document).ready(function(){
				// Prevent modal window from closing when interacting with individual post
				$("#modal-box").click(function(event){
					event.stopPropagation();
				});
			});
		</script>
		<link rel="stylesheet" href="build/css/main.css" media="screen">
		<title>LikeArchive</title>
	</head>
	<body>
		<div ng-app="likeArchive">
			<div ng-controller="UserSearch">
				<header id="navbar">
					<div id="nav-content">
						<span class="nav-logo">
							<img id="nav-logo" src="build/images/LikeArchiveLogo.png" />
						</span>
						<span class="user-input">
							<input id="user-search-input" type="text" name="user" value="rubberninja" placeholder="enter username" ng-keyup="$event.keyCode == 13 && getUserLikes()">.tumblr.com
							<button type="submit" id="search-submit" class="btn btn-search" ng-click="getUserLikes()">Search</button>
						</span>
					</div>
				</header>
				<!--Post Thumbnails-->
				<section id="main-content">
					<ul id="main-list">
						<li class='post-cell' data-ng-repeat="post in thumbnails track by $index" data-cell="{{$index}}">
							<post-thumbnail data=post></post-thumbnail>
							<a href="javascript:void(0);">
								<div class="hover-container {{post.type}}" ng-click="individualPost($index)">
									<p>liked from:<br>{{post.reblogged_from}}</p>
								</div>
							</a>
						</li>
						<li id="load-cell" class="post-cell" ng-click="getMoreLikes()">
							<img src="build/images/plus.png" />
						</li>
					</ul>
				</section>
				<!--Post Modal Window-->
				<div id="popup-container" ng-click="clearModal()">
					<modal-window></modal-window>
				</div>
			</div>
		</div>
	</body>
</html>