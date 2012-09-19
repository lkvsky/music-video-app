//Models
var Diva = Backbone.Model.extend({

	defaults: {
		name: "Artist Name",
		channel: "YouTube Channel",
		videos: []
	},

	url: "/divas"

});

//Collections
var DivaCollection = Backbone.Collection.extend({

	model: Diva,

	url: "/divas"

});

//Views
var AdminView = Backbone.View.extend({

	model: Diva,

	tagName: "div",

	channelSearch: function() {
		$("#channel-list").empty();
		var query = $("#diva-name").val();
		$.ajax({
			url: "https://gdata.youtube.com/feeds/api/channels",
			data: {
				q: query,
				v: 2,
				"max-results": 5,
				alt: "json"
			},
			success: function(json) {
				var channelOptions = [];
				var results = json.feed.entry;
				if (!results) {
					channelOptions.push("Sorry, we couldn't find anything.");
				}
				$.each(results, function(index, channel) {
					channelOptions.push(channel.author[0].name.$t);
				});
				$.each(channelOptions, function(index, channel) {
					channelDiv = $("<div>").html(channel);
					$("#channel-list").append(channelDiv);
				});
			}
		});
	},

	createDiva: function() {
		nameInput = $("#diva-name").val();
		channelInput = $("#diva-channel").val();
		$.ajax({
			type: "POST",
			url: "/divas",
			data: {
				name: nameInput,
				channel: channelInput
			}
		});
	},

	initialize: function() {
		var Divas = new DivaCollection();
		console.log(Divas);
		$("#find-channel").click(this.channelSearch);
		$("#create-diva").click(this.createDiva);
	}

});

//Router
var App = new AdminView();