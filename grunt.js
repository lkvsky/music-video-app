/*global module:false*/
module.exports = function(grunt) {

  var SRC_JS = "static/js/";

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', SRC_JS + 'main.js']
    },
    concat: {
      dist: {
        src: [ SRC_JS + 'lib/jquery-1.8.0.min.js', SRC_JS + 'lib/underscore-min.js', SRC_JS + 'lib/backbone-min.js', SRC_JS + 'main.js'],
        dest: 'build/all.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'build/all.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true,
        dev
      },
      globals: {
        Backbone: true,
        _: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat min');

};
