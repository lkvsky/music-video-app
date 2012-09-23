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

	el: $("#diva-list"),

	divaTemplate: _.template("diva-list-tpl"),

	events: {
		"click #channel-search" : "channelSearch",
		"click #create-diva" : "createDiva"
	},

	initialize: function() {
		//bind listeners for reset and change events
		var divas = new DivaCollection();
		divas.fetch();
		console.log(divas);
		_.bindAll(this, "channelSearch", "createDiva");
		$("#find-channel").click(this.channelSearch);
		$("#create-diva").click(this.createDiva);
		divas.create({name: "Nicki Minaj", channel: "NickiMinajVEVO"}, {
			//success -- clear form
			error: function() {
				console.log("oh hellll no");
			}
		});
	},

	render: function() {
		$(this.el).html(this.divaTemplate({name: this.model.name, channel: this.model.channel}));
		return this;
	},

	addModel: function() {
		//utilize backbone add event to make sure collection knows it's being updated
		//divas.create() to make sure collection is updated properly
	},

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
				if (results === undefined) {
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
		var nameInput = $("#diva-name").val();
		var channelInput = $("#diva-channel").val();
		$.ajax({
			type: "POST",
			url: "/divas",
			data: {
				name: nameInput,
				channel: channelInput
			}
		});
	}

});

//Router
var App = new AdminView();