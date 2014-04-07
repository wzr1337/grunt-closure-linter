/*
 * grunt-closure-linter
 * https://github.com/wzr1337/grunt-closure-linter
 *
 * Copyright (c) 2013-2014 Patrick Bartsch
 * Licensed under the MIT license.
 */

/**
 * @fileoverview This task lets you fix your code using google closure fixstyle.
 * @copyright Patrick Bartsch 2013-2014
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

  var common = require('./lib/common');

  grunt.registerMultiTask('closureFixStyle', 'Apply closure style fixes',
    function() {
      common.registerTool(grunt, this, 'fixjsstyle');
    });
};
