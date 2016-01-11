var async = require('async')
var execFile = require('child_process').execFile
var phpCmd = 'php'
var phpmetricsCmd = 'phpmetrics'

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

function phpmetrix (args, callback) {
  result = execFile(phpmetricsCmd, ['--config='+args.conf], {
    stdio: [
      0, // Use parents stdin for child
			'pipe', // Pipe child's stdout to parent
    	'pipe', // Pipe child's stderr to parent // fs.openSync('err.out', 'w') // Direct child's stderr to a file
    ],
    cwd: process.cwd(),
    env: process.env
  }, callback)
  
  result.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	result.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	result.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
  
  return result;
}

module.exports = {
  cli: function (cfg, opts, cb) {

    var options = {
      stdout: true,
      stderr: true
    }

    var callback = function (err) {
      if (cb) return cb(err)
      if (err) throw new Error(err)
    }

    return phpmetrix(cfg, options, callback)
  },
  
  phpmetrics: function (config, options, callback) {
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
