var async = require('async');
var execFile = require('child_process').execFile;
var phpCmd = 'php';
var phpmetricsCmd = 'phpmetrics';

function testPhp () {
  execFile(phpCmd, ['-v'], function (err, stdout, stderr) {
    console.log(stdout)
    if (err) throw new Error(err)
  })
}

function testPhpmetrics () {
  execFile(phpmetricsCmd, ['--version'], function (err, stdout, stderr) {
    if (err) throw new Error(err)
  })
}

function phpmetrix( config, options, callback ) {

  result = execFile( phpmetricsCmd, [ '--config='+config ], {
    stdio: [
        0,      // Use parents stdin for child
        'pipe', // Pipe child's stdout to parent
        null, // Pipe child's stderr to parent // fs.openSync('err.out', 'w') // Direct child's stderr to a file
    ],
    cwd: process.cwd(),
    env: process.env
  }, callback )

  result.stdout.on( 'data', function( data ) {
    // Data is binary at this point
    console.log( data );
  });

  result.stderr.on( 'data', function( data ) {
    // Data is binary at this point
    console.log( data );
  });

  result.on( 'close', function( code ) {
    // process has been closed
  });

  result.on( 'exit', function( code ) {
    if( code !== 0 ) {
        // process has exited
        //console.log( 'Process exited with code: ' + code);
    }
  });

  return result;
}

module.exports = {
  cli: function (cfg, opts, cb) {

    var options = {
      stdout: true,
      stderr: true
    }

    var callback = function (error, stdout, stderr) {
      //if (cb) return cb(error)
      if (error) throw new Error(error)

      /* To wait until the end of child_process.fileExec
       * before outputting all stderr data:
       */
      /*if (stderr) {
        if (cb) {
            cb(stderr);
        } else {
            console.log(stderr);
        }
      }*/

      /* To wait until the end of child_process.fileExec
       * before outputting all stdout data:
       */
      /*if (stdout) {
        if (cb) {
            cb(stdout);
        } else {
            console.log(stdout);
        }
      }*/
    }

    return phpmetrix(cfg, options, callback)
  },

  phpmetrix: function (config, options, callback) {

    if (typeof options === 'function') {
      callback = options
    }

    if (options.phpCmd) phpCmd = options.phpCmd
    if (options.phpmetricsCmd) phpmetricsCmd = options.phpmetricsCmd

    testPhp()
    testPhpmetrics()

    phpmetrix(config, options, callback)
  },

  gruntPlugin: function (grunt) {
    grunt.task.registerMultiTask('phpmetrix', 'Run static-analysis on PHP files with phpmetrics.', function () {
      var done = this.async()

      testPhp()
      testPhpmetrics()

      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
        stdout: true,
        stderr: true
      })

      phpmetrix(config, options, done)
    })
  }
}
