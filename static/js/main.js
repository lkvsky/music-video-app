require.config({

  paths: {
    jquery: 'lib/jquery-1-8-0-min',
    twitter: 'lib/bootstrap-min',
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone',
    text: 'lib/text',
    select2: 'lib/select2'
  },

  shim: {
	'backbone': {
		deps: ['underscore', 'jquery'],
		exports: 'Backbone'
	},

	'underscore': {
		deps: ['jquery'],
		exports: '_'
	},

  'select2': {
    deps: ['jquery'],
    exports: 'select2'
  }
}

});

require(['views/user-app', 'views/admin-app'], function(UserAppView, AdminAppView){
  //var app = new AdminAppView();
  var AppRouter = Backbone.Router.extend({

    routes: {
      ""      : "userView",
      "admin" : "adminView"
    },

    userView: function() {
      new UserAppView();
    },

    adminView: function() {
      new AdminAppView();
    }

  });
  var app = new AppRouter();
  Backbone.history.start({ pushState : true, root: '/' });
});
