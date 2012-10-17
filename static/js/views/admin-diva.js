define([
'jquery',
'underscore',
'backbone',
'models/diva',
'text!templates/admin-diva.html'
],
function($, _, Backbone, Diva, adminDiva, adminVideo) {
	var DivaAdminView = Backbone.View.extend({

		events: {
			"click .edit-btn"        : "editDiva",
			"click .save-btn"        : "saveDiva",
			"click .destroy"         : "deleteDiva",
			"click .show-videos"     : "showVideos"
		},

		initialize: function() {
			_.bindAll(this, "render");

			this.model.bind('change', this.render);
			this.model.bind('destroy', this.deleteDiva, this);
		},

		render: function() {
			this.compiled = _.template(adminDiva);
			this.item = this.compiled(this.model.toJSON());
			this.rendered = $(this.el).html(this.item);
			return this.rendered;
		},

		editDiva: function() {
			$(this.el).addClass("editing");
		},

		saveDiva: function() {
			this.editedName = this.$(".edited-name").val();
			this.editedChannel = this.$(".edited-channel").val();
			this.model.save({ name : this.editedName, channel : this.editedChannel });
			$(this.el).removeClass("editing");
		},

		deleteDiva: function() {
			$(this.el).remove();
			this.model.destroy();
		},

		showVideos: function() {
			if (!this.$(".video-info").hasClass("hide")){
				this.$(".video-info").addClass("hide");
			} else {
				this.$(".video-info").removeClass("hide");
			}
		}

	});

	return DivaAdminView;
});