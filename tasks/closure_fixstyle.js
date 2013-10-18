/**
 * @fileoverview This task lets you fix your code using google closure fixstyle.
 * @copyright Patrick Bartsch 2013
 * @author Patrick Bartsch <bartsch98@gmail.com>
 * @license MIT
 * 
 * @module tasks/grunt-closure-linter
 */
'use strict';

/**
 * Register the closureStyleFix task to Grunt
 * @constructor
 * @type GruntTask
 * @param {Object} grunt - the grunt context
 */
module.exports = function(grunt) {
  var ctools = require('./lib/ctools');
  grunt.registerMultiTask('closureFixStyle', 'Apply closure style fixes',
      function() {ctools.registerTool(this, 'fixjsstyle.py');});
};
