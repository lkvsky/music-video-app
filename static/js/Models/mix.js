define(['underscore', 'backbone'], function(_, Backbone) {
	var Mix = Backbone.Model.extend({

		urlRoot: '/mixes'

	});
	return Mix;
});