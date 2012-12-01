define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/mix-viewer.html'
	],
	function($, _, Backbone, mixViewer) {
		var mixView = Backbone.View.extend({

			el: $("#user-container"),

			loadYtApi: function(ytid) {
				this.mixTpl = _.template(mixViewer);
				$(this.el).append(this.mixTpl);
				var ytScript = document.createElement('script');
				ytScript.src = "//www.youtube.com/iframe_api";
				$('body').append(ytScript);
				window["onYouTubeIframeAPIReady"] = function() {
					var player = new YT.Player('player', {
						height: '390',
						width: '640',
						videoId: ytid,
						events: {
							'onReady': onPlayerReady
						}
					});
					var onPlayerReady = function(event) {
						event.player.playVideo();
					};
				};
			}

		});
	return mixView;
});