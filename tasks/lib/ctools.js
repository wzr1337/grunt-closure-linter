/**
 * common code goes here
 */

var grunt = require('grunt'),
    exec = require('child_process').exec,
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
    
    var cmd = closureLinterPath + '/' + toolname + files.join(' ');
    cmd += options.strict ? ' --strict' : '';
    //grunt.log.writeln(cmd);

    var task = exec(cmd, options.execOptions, function(err, stdout, stderr) {
      if (_.isFunction(options.callback)) {
        options.callback.call(task, err, stdout, stderr, callback);
      } else {
        if (err && options.failOnError) {
          grunt.warn(err);
        }
        callback();
      }
    });

    if (options.stdout) {
      task.stdout.pipe(process.stdout);
    }

    if (options.stderr) {
      task.stderr.pipe(process.stderr);
    }
  };