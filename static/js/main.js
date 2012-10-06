require.config({

  paths: {
    jquery: 'lib/jquery-1-8-0-min',
    twitter: 'lib/bootstrap-min',
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone-min',
    text: 'lib/text'
  },

  shim: {
  	'backbone': {
  		deps: ['underscore', 'jquery'],
  		exports: 'Backbone'
  	},

  	'underscore': {
  		deps: ['jquery'],
  		exports: '_'
  	}
  }

});

require(['views/admin-app'], function(AdminAppView){
  var app = new AdminAppView();
});
