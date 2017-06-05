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
				<div id="navbar">
					<div id="nav-content">
						<span class="nav-logo">
							<img id="nav-logo" src="build/images/LikeArchiveLogo.png" />
						</span>
						<span class="user-input">
							<input id="user-search-input" type="text" name="user" value="rubberninja" placeholder="enter username">.tumblr.com
							<button type="submit" id="search-submit" class="btn btn-search" ng-click="getUserLikes()">Search</button>
						</span>
					</div>
				</div>
				<!--Post Thumbnails-->
				<div id="main-content">
					<ul id="main-list">
						<li class='post-cell' data-ng-repeat="post in thumbnails track by $index" data-cell="{{$index}}">
							<div ng-if="post.type.isText" class="text-container" ng-bind-html="post.body">
							<!--Text Post-->
								<h5 ng-if="post.type.hasTitle">{{post.title}}</h5>
								{{ post.body }}
							</div>
							
							<div ng-if="post.type.isPhoto" class="image-container" style="background-image: url({{ post.thumbnailURL }}); background-position: top; background-size: cover;">
							<!--Photo Post-->
							</div>
							
							<div ng-if="post.type.isQuote" class="quote-container">
							<!--Quote Post-->
							</div>
							
							<div ng-if="post.type.isLink" class="link-container">
							<!--Link Post-->
							</div>
							
							<div ng-if="post.type.isVideo" class="video-container">
							<!--Video Post-->
							</div>
							
							<div ng-if="post.type.isAnswer" class="qa-container">
							<!--Answer Post-->
								<div class="question-container">
									<p><b>{{post.question.asker}}:</b> {{post.question.question}}</p>
								</div>
								<div class="answer-container" ng-bind-html="post.answer">
									{{post.answer}}
								</div>
							</div>
							<a href="javascript:void(0);">
								<div class="hover-container {{post.type.type}}" ng-click="individualPost($index)">
									<p>liked from:<br>{{post.reblogged_from}}</p>
								</div>
								</a>
						</li>
						<li id="load-cell" class="post-cell" ng-click="getMoreLikes()">
							<img src="build/images/plus.png" />
						</li>
					</ul>
				</div>
				<!--Post Modal Window-->
				<div id="popup-container" ng-click="clearModal()">
					<div id="modal-box">
						<div ng-if="modal_post.post_type.isText">
							<div class="modal-header">
								<p>
									<span class="who-reblog">Liked from {{modal_post.blog_name}}</span>
									<span ng-if="modal_post.hasSource" class="who-source">Source: {{modal_post.source_title}}</span>
								</p>
							</div>
							<div class="modal-caption" ng-bind-html="modal_post.body">
								{{modal_post.body}}
							</div>
							<div class="modal-footer">
								<div class="tags">
									<p>
										<a ng-repeat="tag in modal_post.tags track by $index" href="">#{{tag}}</a>
									</p>
								</div>
								<div class="notes">
									<p>{{modal_post.note_count}} notes</p>
								</div>
							</div>
						</div>
						<div ng-if="modal_post.post_type.isPhoto">
							<div class="modal-header">
								<p>
									<span class="who-reblog">Liked from {{modal_post.blog_name}}</span>
									<span ng-if="modal_post.hasSource" class="who-source">Source: {{modal_post.source_title}}</span>
								</p>
							</div>
							<div class="modal-content">
									<img ng-repeat="photo in modal_post.photos track by $index" src="{{photo.alt_sizes[0].url}}" />
							</div>
							<div class="modal-caption" ng-bind-html="modal_post.caption">
								{{modal_post.caption}}
							</div>
							<div class="modal-footer">
								<div class="tags">
									<p>
										<a ng-repeat="tag in modal_post.tags track by $index" href="">#{{tag}}</a>
									</p>
								</div>
								<div class="notes">
									<p>{{modal_post.note_count}} notes</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>