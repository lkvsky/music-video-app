define([
	'jquery',
	'underscore',
	'backbone',
	'select2',
	'models/mix',
	'collections/divas',
	'text!templates/station-creator.html'
	],
	function($, _, Backbone, select, Mix, DivaCollection, stationCreator) {
		var UserView = Backbone.View.extend({
			
			el: $("#user-container"),

			events: {
				"click #mix-maker": "mixMaker"
			},

			initialize: function() {
				_.bindAll(this, "render", "mixVideos", "mixShuffle");
				this.divas = new DivaCollection();
				this.divas.bind("reset", this.render);
				this.divas.bind("change", this.render);
				this.divas.fetch();
			},

			render: function() {
				this.mixTemplate();
			},

			mixTemplate: function() {
				this.stnTpl = _.template(stationCreator, { divas : this.divas });
				$(this.el).append(this.stnTpl);
			},
			// capture diva IDs to create mix and generate shuffle
			mixMaker: function() {
				var values = $("#diva-selector").val();
				this.mix = new Mix({ values : values });
				this.mixShuffle();
				var firstVid = this.shuffle[0].ytid;
				this.loadYtApi(firstVid);
			},
			// create a master list of possible videos for each retreived model
			mixVideos: function(model) {
				modelValues = model.attributes.values;
				var mixList = [];
				var collection = this.divas;
				$(modelValues).each(function(value) {
					var diva = collection.get(modelValues[value]);
					var videos = diva.attributes.videos;
					mixList = mixList.concat(videos);
				});
				return mixList;
			},
			// pull a shuffled mix from the master list to render
			mixShuffle: function() {
				this.masterList = this.mixVideos(this.mix);
				this.shuffle = [];
				for (i=0; i<10; i++) {
					this.shuffle.push(this.masterList[Math.floor(Math.random() * this.masterList.length)]);
				}
			},

			loadYtApi: function(ytid) {
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
						event.target.playVideo();
					};
				};
			}

		});
	return UserView;
});