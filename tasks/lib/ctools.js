/**
 * common code goes here
 */

var grunt = require('grunt'),
    exec = require('child_process').exec,
    path = require('path'),
    _ = grunt.util._;

module.exports.registerTool = function(task, toolname) {
    var done = task.async(),
        files = [],
        closureLinterPath = task.data.closureLinterPath || '/usr/local/bin',
        options = grunt.task.current.options(
        {
          stdout : true,
          stderr : false,
          failOnError : true,
          strict : false
        });

    // Toolname in options
    toolname = task.data.command || toolname;

    // Iterate over all src-dest file pairs.
    task.files.forEach(function(f) {
      files = files.concat(grunt.file.expand(f.src));
    });
    //grunt.log.writeflags(options, 'options');

    var cmd = closureLinterPath + '/' + toolname;
    cmd += options.strict ? ' --strict ' : ' ';
    // add commands to send to gjslint from option called opt
    cmd += options.opt + ' ';
    cmd += files.join(' ');
    //grunt.log.writeln(cmd);

    // Whether to output the report to a file or stdout
    var outputResults = options.stdout;
    delete options.stdout;

    var reportFormat = options.reporter || 'closure';
    delete options.reporter;

    var convertResults;
    if (0 === toolname.indexOf('gjslint') && reportFormat) {
      convertResults = Converter[reportFormat.toUpperCase()];
    }

    var linterCallback = function(error, stdout, stderr) {
      if (!error && outputResults) {
        writeResults(stdout, outputResults);
      }
      if (_.isFunction(options.callback)) {
        options.callback.call(task, error, stdout, stderr, done);
      } else {
        if (error && options.failOnError) {
          writeResults(stdout, null);
          grunt.warn(error);
        }
        done();
      }
    };
    var child = exec(cmd, options.execOptions, function(error, stdout, stderr) {
      convertResults ?
          convertResults(stdout, linterCallback) :
          linterCallback.apply(null, arguments);
    });

    if (options.stderr) {
      child.stderr.pipe(process.stderr);
    }
  };


/**
 * Writes linter |results| to file or stdout if file path is not provided.
 * @param {!string} results Linter results as a string.
 * @param {string=} opt_filePath File to write results into. Optional.
 */
function writeResults(results, opt_filePath) {
  if (typeof opt_filePath === 'string') {
    var filePath = opt_filePath;
    filePath = grunt.template.process(filePath);
    var destDir = path.dirname(filePath);
    if (!grunt.file.exists(destDir)) {
      grunt.file.mkdir(destDir);
    }
    grunt.file.write(filePath, results);
    grunt.log.ok('File "' + filePath + '" created.');
  }
  else {
    process.stdout.write(results);
  }
}


/**
 * Results format converters.
 * @enum {function|undefined}
 */
var Converter = {
  CLOSURE: undefined,  // Conversion is not needed.
  JSLINT: jslintConverter
};


/**
 * Folder with converter scripts.
 * @const
 * @type {string}
 */
var CONVERTERS_ROOT_DIR = path.join(__dirname, '..', '..', 'converters');


/**
 * Converts Closure Linter results to JSLint XML format.
 * @param {string} results Closure Linter results string.
 * @param {!function} callback Operation callback.
 */
function jslintConverter(results, callback) {
  var cmd = path.join(CONVERTERS_ROOT_DIR, 'jslint.py');
  var converterProcess = exec(cmd, null, callback);
  converterProcess.stdin.end(results);
}
