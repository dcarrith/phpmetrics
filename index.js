var async = require('async')
var execFile = require('child_process').execFile
var phpCmd = 'php'
var phpmetricsCmd = 'phpmetrics'

function testPhp () {
  execFile(phpCmd, ['-v'], function (err, stdout, stderr) {
    if (err) throw new Error(err)
  })
}

function testPhpmetrics () {
  execFile(phpmetricsCmd, ['--version'], function (err, stdout, stderr) {
    if (err) throw new Error(err)
  })
}

function phpmetrics (config, callback) {
  return execFile(phpmetricsCmd, ['--config='+config], {
    cwd: process.cwd(),
    env: process.env
  }, callback)
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

    return phpmetrics(cfg, options, callback)
  },
  
  phpmetrics: function (config, options, callback) {
    if (typeof options === 'function') {
      callback = options
    }

    if (options.phpCmd) phpCmd = options.phpCmd
    if (options.phpmetricsCmd) phpmetricsCmd = options.phpmetricsCmd

    testPhp()
    testPhpmetrics()

    phpmetrics(config, options, callback)
  },

  gruntPlugin: function (grunt) {
    grunt.task.registerMultiTask('phpmetrics', 'Run static-analysis on PHP files with phpmetrics.', function () {
      var done = this.async()

      testPhp()
      testPhpmetrics()

      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
        stdout: true,
        stderr: true
      })

      phpmetrics(config, options, done)
    })
  }
}
