define(['underscore', 'backbone', 'models/diva'], function(_, Backbone, Diva) {
	var Divas = Backbone.Collection.extend({

		model: Diva,

		url: "/divas"
	});
	return Divas;
});