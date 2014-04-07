/*
 * grunt-closure-linter
 * https://github.com/wzr1337/grunt-closure-linter
 *
 * Copyright (c) 2013-2014 Patrick Bartsch
 * Licensed under the MIT license.
 */

'use strict';


var grunt = require('grunt'),
    path = require('path');


// ---------------------------------------------
// -             PRIVATE UTILS                 -
// ---------------------------------------------


/**
 * Test if a string ends with a given suffix.
 * @param {string} str String to be checked.
 * @param {string} suffix Suffix.
 * @return {boolean} Returns true if suffix was found. 
 */
var stringEndsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};


/**
 * Create the linter command.
 * @param {object} options Grunt options.
 * @param {array=} opt_fileList List of source files to be linted.
 * @param {array=} opt_dirList List of directories to be linted.
 */
var createLinterCommand = function(options, opt_fileList, opt_dirList) {

  var cmd = '';

  // Detect if the tool file is a python script. If so we need to
  // prefix the exec command with 'python'.
  if (stringEndsWith(options.toolFile, '.py')) {
    cmd += 'python ';
  }

  // Normalize the folder path and join the tool file.
  cmd += path.join(path.resolve(options.closureLinterPath), options.toolFile) + ' ';

  // Set command flags
  cmd += (options.strict) ? '--strict ' : '';
  cmd += (options.maxLineLength) ? '--max_line_length ' + options.maxLineLength + ' ' : '';

  // Finally add files to be linted
  if (opt_dirList && opt_dirList.length > 0) {
    cmd += opt_dirList.map(function(value) {return '-r ' + value;}).join(' ') + ' ';
  }

  if (opt_fileList && opt_fileList.length > 0) {
    cmd += opt_fileList.join(' ');
  }

  return cmd;
};


/**
 * Writes linter |results| to file.
 * @param {!string} results Linter results as a string.
 * @param {!string} filePath Path to the file.
 */
var writeResults = function(results, filePath) {

  var destDir = path.dirname(filePath);

  if (!grunt.file.exists(destDir)) {
    grunt.file.mkdir(destDir);
  }

  grunt.file.write(filePath, results);
  grunt.log.ok('File "' + filePath + '" created.');
};


// ---------------------------------------------
// -             Module Exports                -
// ---------------------------------------------


module.exports.registerTool = function(grunt, task, toolname) {
  var taskDone = task.async(),
      CommandRunner = require('./commandrunner'),
      converter = require('./converter/converter'),
      options,
      cmdrunnner;

  // Merge task-specific and/or target-specific options with these defaults.
  options = task.options({
        closureLinterPath: '/usr/local/bin',
        toolFile: toolname,
        stdout: true,
        stderr : true,
        failOnError : true,
        strict: false,
        converter: 'closure'
      });

  // Create the command runnner instance.
  // In case stdout is pointing to a file avoid logging into default stdout.
  cmdrunnner = new CommandRunner(options.stdout, options.stderr,
    options.failOnError, converter.getConverter(options.converter));

  // Iterate over all src-dest file pairs.
  task.files.forEach(function(f) {
    var fileList, dirList;

    // Get all source files to be linted
    fileList = grunt.file.expand({filter: 'isFile'}, f.src);

    // Get all directories to be scanned and linted
    dirList = grunt.file.expand({filter: 'isDirectory'}, f.src);

    cmdrunnner.queueCommand(createLinterCommand(options, fileList, dirList),
      function(error, stdout) {
        if (f.dest) {
          writeResults(stdout, path.normalize(f.dest));
        }
      });
  });

  // Finaly execute all queued commands
  cmdrunnner.run(function(success) {
    taskDone(success);
  });
};