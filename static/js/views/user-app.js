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
				_.bindAll(this, "render");
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

			mixMaker: function() {
				var mixList = [];
				var values = $("#diva-selector").val();
				var collection = this.divas;
				$(values).each(function(value) {
					var diva = collection.get(values[value]);
					var videos = diva.attributes.videos;
					mixList = mixList.concat(videos);
				});
				console.log(mixList);
				this.mix = new Mix({ values : this.values });
				this.mix.save();
			}

		});
	return UserView;
});