define(['underscore', 'backbone'], function(_, Backbone) {
	var Diva = Backbone.Model.extend({

		defaults: {
			name: "Artist Name",
			channel: "YouTube Channel"
		},

		urlRoot: "/divas"

	});
	return Diva;
});

