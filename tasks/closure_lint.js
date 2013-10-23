/**
 * @fileoverview This task lets you lint your code using google closure linter.
 * @copyright Patrick Bartsch 2013
 * @author Patrick Bartsch <bartsch98@gmail.com>
 * @license MIT
 *
 * @module tasks/grunt-closure-linter
 */
'use strict';

/**
 * Register the closureLint task and helpers to Grunt
 * @constructor
 * @type GruntTask
 * @param {Object} grunt - the grunt context
 */
module.exports = function(grunt) {

  var ctools = require('./lib/ctools');
  grunt.registerMultiTask('closureLint', 'Apply closure linting',
      function() {ctools.registerTool(this, 'gjslint.py');});
};
