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
		<link rel="stylesheet" href="css/style.css" media="screen">
		<title>LikeArchive</title>
	</head>
	<body>
		<div id="navbar">
			<div id="nav-content">
				<span class="nav-logo">
					<img id="nav-logo" src="img/LikeArchiveLogo.png" />
				</span>
				<span class="user-input">
					<input id="input" type="text" name="user" value="rubberninja" placeholder="enter username">.tumblr.com
				</span>
			</div>
		</div>
		<!--Generated content goes here-->
		<div id="main-content">
			<h2 id="error-message">Oops! It seems that either this user doesn't exist, or the user set their liked posts to private</h2>
			<ul id="main-list">
			</ul>
		</div>
		<div id="popup-container">
			<div id="modal-box">
			</div>
		</div>
		<script type="text/javascript" src="post_constructor.js"></script>
		<!--end generated content-->
		<!--Posts list Handlebars.js template-->
		<script id="list-template" type="text/x-handlebars-template">
				{{#posts}}
					<li class='post-cell' data-cell="{{ID}}">
							{{#if type.isText}}
								<div class="text-container">
									{{#if hasTitle}}
										<h5>{{title}}</h5>
									{{/if}}
									{{{body}}}
								</div>
							{{/if}}
							{{#if type.isPhoto}}
								<div class="image-container">
									<img src="{{photoURL}}" />
								</div>
							{{/if}}
							{{#if type.isQuote}}
							{{/if}}
							{{#if type.isLink}}
							{{/if}}
							{{#if type.isVideo}}
							{{/if}}
							{{#if type.isAnswer}}
								<div class="qa-container">
									<div class="question-container">
										<p><b>{{question.asker}}:</b> {{question.question}}</p>
									</div>
									<div class="answer-container">
										{{{answer}}}
									</div>
								</div>
							{{/if}}
						<a href="javascript:void(0);">
						<div class="hover-container" onclick="makePostModal({{ID}})">
							<p>liked from:<br>{{reblogged_from}}</p>
						</div>
						</a>
						<div class='modal-window'>
						</div>
					</li>
				{{/posts}}
				<li id="load-cell" class="post-cell" onclick="loadPosts()">
					<img src="img/plus.png" />
				</li>
		</script>
		<!--end Template-->
		<!--Modal Box Handlebars.s Template-->
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