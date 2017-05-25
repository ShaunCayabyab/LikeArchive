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
		<!--Handlbars.js library-->	  
		<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.js"></script>
		<script src="https://code.angularjs.org/1.5.6/angular-sanitize.min.js"></script>
		<script type="text/javascript" src="src/js/posts.js"></script>
		<link rel="stylesheet" href="src/css/style.css" media="screen">
		<title>LikeArchive</title>
	</head>
	<body>
		<div ng-app="likeArchive">
			<div ng-controller="UserSearch">
				<div id="navbar">
					<div id="nav-content">
						<span class="nav-logo">
							<img id="nav-logo" src="src/img/LikeArchiveLogo.png" />
						</span>
						<span class="user-input">
							<input id="user-search-input" type="text" name="user" value="rubberninja" placeholder="enter username">.tumblr.com
							<button type="submit" id="search-submit" class="btn btn-search" ng-click="getUserLikes()">Search</button>
						</span>
					</div>
				</div>
				<div id="main-content">
					<ul id="main-list">
						<li class='post-cell' data-ng-repeat="post in thumbnails track by $index" data-cell="{{$index}}">
							<div ng-if="post.type.isText" class="text-container" ng-bind-html="post.body">
							<!--Text Post-->
								<h5 ng-if="post.type.hasTitle">{{post.title}}</h5>
								{{ post.body }}
							</div>
							
							<div ng-if="post.type.isPhoto" class="image-container">
							<!--Photo Post-->
								<img ng-src="{{ post.photoURL }}" />
							</div>
							
							<div ng-if="post.type.isQuote" class="text-container">
							<!--Quote Post-->
							</div>
							
							<div ng-if="post.type.isLink" class="text-container">
							<!--Link Post-->
							</div>
							
							<div ng-if="post.type.isVideo" class="text-container">
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
								<div class="hover-container" ng-click="">
									<p>liked from:<br>{{post.reblogged_from}}</p>
								</div>
								</a>
						</li>
						<li id="load-cell" class="post-cell" onclick="loadPosts()">
							<img src="src/img/plus.png" />
						</li>
					</ul>
				</div>
				<div id="popup-container">
					<div id="modal-box">
					</div>
				</div>
			</div>
		</div>
		<!--Modal Box Handlebars.js Template-->
		<script id="modal-box-template" type="text/x-handlebars-template">
				{{#if post_type.isText}}
					<div class="modal-header">
						<p>
							<span class="who-reblog">Liked from {{blog_name}}</span>
							{{#if hasSource}}
								<span class="who-source">Source: {{source_title}}</span>
							{{/if}}
						</p>
					</div>
					<div class="modal-caption">
						{{{body}}}
					</div>
					<div class="modal-footer">
						<div class="tags">
							<p>
								{{#tags}}
									<a href="">#{{this}}</a>
								{{/tags}}
							</p>
						</div>
						<div class="notes">
							<p>{{note_count}} notes</p>
						</div>
					</div>
				{{/if}}
				{{#if post_type.isPhoto}}
					<div class="modal-header">
						<p>
							<span class="who-reblog">Liked from {{blog_name}}</span>
							{{#if hasSource}}
								<span class="who-source">Source: {{source_title}}</span>
							{{/if}}
						</p>
					</div>
					<div class="modal-content">
						{{#photos}}
							<img src="{{alt_sizes.0.url}}" />
						{{/photos}}
					</div>
					<div class="modal-caption">
						{{{caption}}}
					</div>
					<div class="modal-footer">
						<div class="tags">
							<p>
								{{#tags}}
									<a href="">#{{this}}</a>
								{{/tags}}
							</p>
						</div>
						<div class="notes">
							<p>{{note_count}} notes</p>
						</div>
					</div>
				{{/if}}
				{{#if post_type.isQuote}}
				{{/if}}
				{{#if post_type.isLink}}
				{{/if}}
				{{#if post_type.isVideo}}
				{{/if}}
				{{#if post_type.isAnswer}}
				{{/if}}
		</script>
		<!--End Template-->
	</body>
</html>