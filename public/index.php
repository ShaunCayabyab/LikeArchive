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
							<div ng-if="post.type == 'text'" class="thumbnail-container text-container">
							<!--Text Post-->
								<h4 class="thumbnail-title" ng-if="post.hasTitle">{{post.title}}</h4>
								<div ng-bind-html="post.body">{{ post.body }}</div>
							</div>
							
							<div ng-if="post.type == 'photo'" class="thumbnail-container image-container" style="background-image: url({{ post.thumbnail_url }}); background-position: top; background-size: cover;">
							<!--Photo Post-->
							</div>
							
							<div ng-if="post.type == 'quote'" class="thumbnail-container quote-container">
							<!--Quote Post-->
							</div>
							
							<div ng-if="post.type == 'link'" class="thumbnail-container link-container">
							<!--Link Post-->
							</div>
							
							<div ng-if="post.type == 'video'" class="thumbnail-container video-container" style="background-image: url({{ post.thumbnail_url }}); background-position: top; background-size: cover;">
							<!--Video Post-->
								<img class="video-svg" src="build/images/play-icon.png" />
							</div>
							
							<div ng-if="post.type == 'audio'" class="thumbnail-container audio-container">
							<!--Audio Post-->
								<h4>&#9658;{{post.title}}</h4>
								<p>{{post.subtitle}}</p>
							</div>

							<div ng-if="post.type == 'answer'" class="thumbnail-container qa-container">
							<!--Answer Post-->
								<div class="question-container">
									<p><b>{{post.question.asker}}:</b> {{post.question.question}}</p>
								</div>
								<div class="answer-container" ng-bind-html="post.answer">
									{{post.answer}}
								</div>
							</div>
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
				</div>
				<!--Post Modal Window-->
				<div id="popup-container" ng-click="clearModal()">
					<div id="modal-box">
						<div class="modal-header">
							<p>
								<span class="who-reblog">Liked from {{modal_post.blog_name}}</span>
								<span ng-if="modal_post.hasSource" class="who-source">Source: {{modal_post.source_title}}</span>
							</p>
						</div>
						<div ng-if="modal_post.post_type == 'text'">
							<!--Text Modal-->
							<div class="modal-content">
								<h2 class="modal-text-title">{{modal_post.title}}</h2>
							</div>
							<div class="modal-caption" ng-bind-html="modal_post.body">
								{{modal_post.body}}
							</div>
						</div>
						<div ng-if="modal_post.post_type == 'photo'">
							<!--Photo Modal-->
							<div class="modal-content">
								<img ng-repeat="photo in modal_post.photos track by $index" src="{{photo.alt_sizes[1].url}}" />
							</div>
							<div class="modal-caption" ng-bind-html="modal_post.caption">
								{{modal_post.caption}}
							</div>
						</div>
						<div ng-if="modal_post.post_type == 'video'">
							<!--Video Modal-->
							<video ng-if="modal_post.video_type == 'tumblr'" width="100%" controls>
								<source src="{{modal_post.video_url}}" type="video/mp4">
								Your browser does not support the video tag
							</video>
							<div ng-if="modal_post.video_type == 'youtube'" class="modal-video">
								<iframe ng-src="{{modal_post.permalink_url | trusted}}" frameborder="0" allowfullscreen></iframe>
							</div>
							<div class="modal-caption" ng-bind-html="modal_post.caption">
								{{modal_post.caption}}
							</div>
						</div>
						<div ng-if="modal_post.post_type == 'audio'">
							<!--Audio Modal-->
							<div class="modal-content">
								<iframe class="tumblr_audio_player tumblr_audio_player_161433091425" src="{{modal_post.new_audio_url}}" frameborder="0" allowtransparency="true" scrolling="no" width="500" height="85"></iframe>
							</div>
							<div class="modal-caption" ng-bind-html="modal_post.caption">
								{{modal_post.caption}}
							</div>
						</div>
						<div class="modal-footer">
							<div class="tags-list">
								<p>
									<a class="tag" ng-repeat="tag in modal_post.tags track by $index" href="">#{{tag}}</a>
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
	</body>
</html>