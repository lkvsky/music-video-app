//Models
var Diva = Backbone.Model.extend({

	defaults: {
		name: "Artist Name",
		channel: "YouTube Channel"
	},

	urlRoot: "/divas"

});

//Collection
var Divas = Backbone.Collection.extend({

	model: Diva,

	url: "/divas"
});

//Views
var DivaView = Backbone.View.extend({

	model: Diva,

	events: {
		"click #edit-btn" : "editDiva",
		"click #save-btn" : "saveDiva",
		"click .destroy"  : "deleteDiva"
	},

	initialize: function() {
		_.bindAll(this, "render");

		this.model.bind('change', this.render);
		this.model.bind('destroy', this.deleteDiva);
	},

	render: function() {
		var compiled = _.template($("#diva-view-tpl").html());
		var item = compiled(this.model.toJSON());
		var rendered = $(this.el).html(item);
		return rendered;
	},

	editDiva: function() {
		$(this.el).addClass("editing");
	},

	saveDiva: function() {
		var editedName = $("#edited-name").val();
		var editedChannel = $("#edited-channel").val();
		this.model.save({ name : editedName, channel : editedChannel });
		$(this.el).removeClass("editing");
	},

	deleteDiva: function() {
		this.model.destroy();
		this.model.remove();
	}

});

var AdminView = Backbone.View.extend({

	events: {
		"click #find-channel" : "channelSearch",
		"click #create-diva"  : "createDiva"
	},

	initialize: function() {
		_.bindAll(this, 'channelSearch', 'createDiva');

		this.divas = new Divas();

		this.divas.bind("reset", this.displayAll, this);
		this.divas.bind("change", this.displayDiva, this);

		this.divas.fetch();
	},

	displayDiva: function(diva) {
		var view = new DivaView({model:diva});
		$("#diva-list").append(view.render());
	},

	displayAll: function() {
		this.divas.each(this.displayDiva);
	},

	createDiva: function() {
		var nameInput = $("#diva-name").val();
		var channelInput = $("#diva-channel").val();
		this.divas.add({ name : nameInput, channel : channelInput });
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
					var channelDiv = $("<div>").html(channel);
					$("#channel-list").append(channelDiv);
				});
			}
		});
	}

});

var App = new AdminView();