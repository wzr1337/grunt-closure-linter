/**
 * common code goes here
 */

var grunt = require('grunt'),
    exec = require('child_process').exec,
    path = require('path'),
    _ = grunt.util._;

module.exports.registerTool = function(task, toolname) {
    var callback = task.async(),
        files = [],
        closureLinterPath = task.data.closureLinterPath,
        options = grunt.task.current.options(
        {
          stdout : false,
          stderr : false,
          failOnError : true,
          strict : false
        }); 
    // Iterate over all src-dest file pairs.
    task.files.forEach(function(f) {
      files = files.concat(grunt.file.expand(f.src));
    });
    //grunt.log.writeflags(options, 'options');
    
    var cmd = closureLinterPath + '/' + toolname;
    cmd += options.strict ? ' --strict ' : ' ';
    cmd += files.join(' ');
    //grunt.log.writeln(cmd);

    // Whether to output the report to a file or stdout
    var outputResults = options.stdout;
    delete options.stdout;

    var child = exec(cmd, options.execOptions, function(err, stdout, stderr) {
      if (outputResults && typeof outputResults === 'string') {
        outputResults = grunt.template.process(outputResults);
        var destDir = path.dirname(outputResults);
        if (!grunt.file.exists(destDir)) {
          grunt.file.mkdir(destDir);
        }
        grunt.file.write(outputResults, stdout);
        grunt.log.ok('File "' + outputResults + '" created.');
      }
      else if (outputResults) {
        process.stdout.write(stdout);
      }

      if (_.isFunction(options.callback)) {
        options.callback.call(task, err, stdout, stderr, callback);
      } else {
        if (err && options.failOnError) {
          grunt.warn(err);
        }
        callback();
      }
    });

    if (options.stderr) {
      child.stderr.pipe(process.stderr);
    }
  };