#!/usr/bin/env node

var exec = require('child_process').exec
var args = process.argv.slice(2)
var cli = require('./').cli
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({filename: 'node.log'})
    ]
});

if (process.env.NODE_ENV === 'test') {
    console.log('Adding winston.transports.Console as the logger.');
    logger.add(winston.transports.Console, {prettyPrint: true});
}

if (args.length === 0 || (args.length === 1 && args[0] === 'help')) {
  console.log([
    '',
    '  Usage: phpmetrix path/to/config.yml',
    '',
    '  Examples:',
    '  phpmetrix config.yml',
    ''
  ].join('\n'))
    process.exit()
}

if (args[0] === '-v' || args[0] === '--version') {
  var pkg = require('./package.json')
  process.exit()
}

exec('php -v', function (err, stdout, stderr) {
  if (err) throw new Error(err)
})

exec('phpmetrics --version', function (err, stdout, stderr) {
  if (err) throw new Error(err)
})

cli( args );
