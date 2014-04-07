/*
 * grunt-closure-linter
 * https://github.com/wzr1337/grunt-closure-linter
 *
 * Copyright (c) 2013-2014 Patrick Bartsch
 * Licensed under the MIT license.
 */

 'use strict';

var grunt = require('grunt'),
    _ = grunt.util._,
    exec = require('child_process').exec;

/**
 * Command Runner.
 * @param {boolean=} opt_stdout If true log std. out into console.
 *   Default is false.
 * @param {boolean=} opt_stderr If true log std. errors into console.
 *   Default is true.
 * @param {boolean=} opt_failOnError Abort Command Runner upon failure.
 *   Defaullt is true.
 * @param {function=} opt_converter stdout converter.
 */
var CommandRunner = module.exports = function (opt_stdout, opt_stderr, opt_failOnError, opt_converter) {

  this.stdout_ = (_.isBoolean(opt_stdout)) ? opt_stdout : false;
  this.stderr_ = (_.isBoolean(opt_stderr)) ? opt_stderr : true;
  this.failOnError_ = (_.isBoolean(opt_failOnError)) ? opt_failOnError : true;
  this.converter_ = opt_converter;

  this.cmdQueue_ = [];
  this.isBusy_ = false;
};

/**
 * Enqueue a command which shall be executed by the CommandRunner.
 * @param {string} cmd Command as String.
 * @param {function} callback Callback function to be invoked
 *   after the command has been executed. Callback arguments are
 *   function(error, stdout, stderr)
 */
CommandRunner.prototype.queueCommand = function(cmd, callback) {

  // Push the command into the command queue.
  this.cmdQueue_.push({
    cmd: cmd,
    callback: callback
  });
};


/**
 * Execute all enqueued commands.
 * @param {function} callback Callback function to be invoked
 *   after all commands have been executed or an error has been
 *   raised while running the commands. As first argument true
 *   (if no error has occured) or false will be passed. 
 */
CommandRunner.prototype.run = function(callback) {

  if (!this.isBusy_) {
    this.isBusy_ = true;
    // Trigger the command queue iterator...
    this.runNextCommand_(callback);

  } else {
    if (_.isFunction(callback)) {
      // Give an error callback as the runner is already busy
      callback(false);
    }
  }
};


/**
 * Internal iterator over all queued commands.
 * @param {function} callback Callback function to be invoked
 *   after all commands have been executed or an error has been
 *   raised while running the commands. As first argument true
 *   (if no error has occured) or false will be passed. 
 */
CommandRunner.prototype.runNextCommand_ = function(callback) {

  var currentCmd, childprocess, self = this, triggerNext;

  triggerNext = function(error) {
      if (!error || !self.failOnError_) {
        self.runNextCommand_(callback);
      } else {
        // Give an error callback and reset the queue
        callback(false);
        self.cmdQueue_ = [];
      }
  };

  if (this.cmdQueue_.length > 0) {

    // Get the next command to be executed
    currentCmd = this.cmdQueue_.shift();

    grunt.log.debug('Execute:', currentCmd.cmd);

    // Run the command...
    childprocess = exec(currentCmd.cmd, null, function(error, stdout, stderr) {

      // Give a callback that the command has been executed
      if (_.isFunction(currentCmd.callback)) {
        // Make the callback async.
        setTimeout(function() {
          if (_.isFunction(self.converter_)) {
            // Pipe all stdout data through the converter
            self.converter_(stdout, function(convStdOut) {
              currentCmd.callback(error, convStdOut, stderr);
              triggerNext(error);
            });
          } else {
            currentCmd.callback(error, stdout, stderr);
            triggerNext(error);
          }
        }, 0);

      } else {
        // Just continue as no callback function is set
        triggerNext(error);
      }
    });

    if (this.stdout_) {
      childprocess.stdout.pipe(process.stdout);
    }

    if (this.stderr_) {
      childprocess.stderr.pipe(process.stderr);
    }

  } else {
    // Return true as all commands have been executed.
    callback(true);
  }
};