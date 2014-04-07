/*
 * grunt-closure-linter
 * https://github.com/wzr1337/grunt-closure-linter
 *
 * Copyright (c) 2013-2014 Patrick Bartsch
 * Licensed under the MIT license.
 */

/**
 * @fileoverview This task lets you lint your code using google closure linter.
 * @copyright Patrick Bartsch 2013-2014
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

  var common = require('./lib/common');

  grunt.registerMultiTask('closureLint', 'Apply closure linting',
    function() {
      common.registerTool(grunt, this, 'gjslint');
    });
};
