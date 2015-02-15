module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'ng-alertify.js'
      ],
      specs: ['test/*-spec.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'version', 'main',
            'private', 'license', 'keywords', 'homepage'],
        }
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: ['*.js', 'test/*.js', 'package.json'],
        tasks: ['jshint', 'test']
      }
    },

    'gh-pages': {
      options: {
        base: '.'
      },
      src: [
        'README.md',
        'ng-alertify.js',
        'index.html',
        'node_modules/es5-shim/es5-shim.js',
        'bower_components/angular/angular.js',
        'bower_components/alertify.js/lib/alertify.js',
        'bower_components/alertify.js/themes/alertify.core.css',
        'bower_components/alertify.js/themes/alertify.default.css'
      ]
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['karma']);
  grunt.registerTask('default',
    ['nice-package', 'deps-ok', 'sync', 'jshint', 'test']);
};
