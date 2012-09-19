//Models
var Diva = Backbone.Model.extend({

	defaults: {
		name: "Artist Name",
		channel: "YouTube Channel",
		videos: []
	}

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
		$("#create-diva").click(this.createDiva);
	}

});

//Router
var App = new AdminView();