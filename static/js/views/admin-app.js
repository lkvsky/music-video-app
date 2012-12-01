define([
	'jquery',
	'underscore',
	'backbone',
	'models/diva',
	'collections/divas',
	'views/admin-diva',
	'views/user-app',
	'text!templates/admin-creator.html'
],
function($, _, Backbone, Diva, DivaCollection, DivaAdminView, UserApp, adminCreator) {
	var AdminAppView = Backbone.View.extend({

		el: $("#admin-container"),

		events: {
			"click #find-channel" : "channelSearch",
			"click #create-diva"  : "createDiva"
		},

		initialize: function() {
			_.bindAll(this, 'channelSearch', 'createDiva');

			this.divas = new DivaCollection();

			this.divas.bind("reset", this.displayAll, this);
			this.divas.bind("add", this.displayDiva, this);

			this.divas.fetch();

			this.render();
		},

		render: function() {
			this.compiledCreator = _.template(adminCreator);
			this.templateCreator = this.compiledCreator();
			$("#diva-creator").append(this.templateCreator);
		},

		displayDiva: function(diva) {
			this.singleView = new DivaAdminView({model:diva});
			this.$("#diva-list").append(this.singleView.render());
		},

		displayAll: function() {
			this.divas.sort({silent:true});
			this.divas.each(this.displayDiva);
		},

		createDiva: function() {
			this.nameInput = $("#diva-name").val();
			this.channelInput = $("#diva-channel").val();
			this.divas.create(
				{ name : this.nameInput, channel : this.channelInput },
				{ wait : true}
			);
		},

		channelSearch: function() {
			$("#diva-channel").empty();
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
						var channelOption = $("<option>").val(channel);
						channelOption.html(channel);
						$("#diva-channel").append(channelOption);
					});
				}
			});
		}

	});
	return AdminAppView;
});