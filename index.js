var async = require('async');
var execFile = require('child_process').execFile;
var winston = require('winston');
var phpCmd = 'php';
var phpmetricsCmd = 'phpmetrics';

winston.level = 'info';

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({filename: 'node.log'})
    ]
});

if (process.env.NODE_ENV === 'test') {
    winston.log('Removing winston.transports.Console as the logger.');
    logger.remove(winston.transports.Console);
} else {
    winston.log('Adding winston.transports.Console as the logger.');
    logger.add(winston.transports.Console, {prettyPrint: true});
}

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

function phpmetrix( args, options, callback ) {

  result = execFile( phpmetricsCmd, args, {
    stdio: [
        0,      // Use parents stdin for child
        'pipe', // Pipe child's stdout to parent
        null,   // Pipe child's stderr to parent // fs.openSync('err.out', 'w') // Direct child's stderr to a file
    ],
    cwd: process.cwd(),
    env: process.env
  }, callback );

  /*result.stdout.on( 'data', function( data ) {
    // Data is binary at this point
    console.log( data );
  });

  result.stderr.on( 'data', function( data ) {
    // Data is binary at this point
    console.log( data );
  });

  result.on( 'close', function( code ) {
    // process has been closed
    //winston.log( 'Process closed with code: ' + code);
  });*/

  result.on( 'exit', function( code ) {
    // process has exited
    //winston.log( 'Process exited with code: ' + code);
  });

  return result;
}

module.exports = {

  cli: function( args, options, callback ) {
    return phpmetrix( args, options, callback );
  },

  phpmetrix: function( args, options, callback ) {

    if ( typeof options === 'function' ) {
      callback = options;

      options = { stdio: [
                        0,      // Use parents stdin for child
                        'pipe', // Pipe child's stdout to parent
                        null,   // Pipe child's stderr to parent // fs.openSync('err.out', 'w') // Direct child's stderr to a file
                  ],
                  quiet: false,
                  debug: false };
    }

    // Allow the path to php and phpmetrics be set by user
    if ( options.phpCmd ) phpCmd = options.phpCmd;
    if ( options.cmd ) phpmetricsCmd = options.cmd;

    testPhp();
    testPhpmetrics();

    phpmetrix( args, options, callback );
  },

  gruntPlugin: function( grunt ) {
    grunt.task.registerMultiTask( 'phpmetrix', 'Run static-analysis on PHP files with phpmetrics.', function() {

      var done = this.async()

      testPhp()
      testPhpmetrics()

      var options = this.options({
        stdio: 'inherit',
        quiet: false,
        debug: false
      })

      phpmetrix( args, options, done );
    })
  }
}
