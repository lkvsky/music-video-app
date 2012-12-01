define(['underscore', 'backbone', 'models/diva'], function(_, Backbone, Diva) {
	var Divas = Backbone.Collection.extend({

		model: Diva,

		url: "/divas",

		comparator: function(diva) {
			return diva.get("name");
		}

	});
	return Divas;
});