/* global describe, it, before, after */
'use strict'

var Q = require('q');
var fs = require('fs');
var chai = require('chai');
var wrapper = require('../');
var binCheck = require('bin-check');
var phpmetrix = wrapper.phpmetrix;
var cli = wrapper.cli;


process.env.NODE_ENV = 'test';


var configFilePath = __dirname + '/config.yml';
var nonConfigFilePath = __dirname + '/nonconfig.yml';

// Base directory to which the artifacts should be saved
var reportsDir = 'test/reports/';

var reportXML       = reportsDir + 'phpmetrics.xml';
var reportHTML      = reportsDir + 'phpmetrics.html';
var reportJSON      = reportsDir + 'phpmetrics.json';
var reportCSV       = reportsDir + 'phpmetrics.csv';
var violationsXML   = reportsDir + 'violations.xml';
var bubblesSVG      = reportsDir + 'bubbles.svg';

// We can pass in an array of options
var options = { stdio: 'inherit',
                quiet: false,
                debug: false,
                args: [ '--report-cli',
                        '--report-html='    + reportHTML,
                        '--report-xml='     + reportXML,
                        '--report-json='    + reportJSON,
                        '--report-csv='     + reportCSV,
                        '--violations-xml=' + violationsXML,
                        '--chart-bubbles='  + bubblesSVG,
                        '--extensions=php',
                        '--excluded-dirs="grunt|node_modules|public|storage|vendor"',
                        '--ansi',
                        '--template-title="PHPMetrix"',
                        '--verbose'
                ],
                path: '.',
                config: configFilePath };

var args = [];

var quiet = (( !options.quiet ) ? false : options.quiet );
var debug = (( !options.debug ) ? false : options.debug );

if( options.args ) {
    args = options.args;
}

if( options.config ) {
    args.unshift( '--config=' + options.config );
}

if( options.path ) {
    args.push( options.path );
} else {
    args.push( '"."' );
}

var ansi = args.indexOf('--ansi') - 1;
var noansi = args.indexOf('--no-ansi') - 1;

// Check for the possibility of passing in two conflicting options
if(( ansi >= 0 ) && ( noansi >= 0 )) {

    // Slice off the one that was entered second
    args.splice((( ansi > noansi ) ? ansi : noansi), 1);
}

chai.should();

function confirmReportArtifactDoesNotExist( artifact, done ) {

    try
    {
        // This actually throws an error when the file does not exist
        ( fs.statSync( artifact ).isFile() ).should.be.false;
    }
    catch (err)
    {
        // Now, we can actually run the test to confirm
        ( err !== 'undefined' ).should.be.true;
    }

    done();
}

function unlinkExistingArtifact( artifact ) {

    if( fs.exists( artifact )) {

        fs.unlink( artifact, function( err ) {
            if ( err ) throw err;
        });
    }
}

describe('phpmetrix', function () {

    describe( 'using Node', function() {

        before( function() {

            unlinkExistingArtifact( reportXML );
            unlinkExistingArtifact( reportHTML );
            unlinkExistingArtifact( reportJSON );
            unlinkExistingArtifact( reportCSV );
            unlinkExistingArtifact( violationsXML );
            unlinkExistingArtifact( bubblesSVG );
        });

        it( 'should not have existing report in XML format at startup of test', function (done) {

            confirmReportArtifactDoesNotExist( reportXML, done );
        });

        it( 'should not have existing report in HTML format at startup of test', function (done) {

            confirmReportArtifactDoesNotExist( reportHTML, done );
        });

        it( 'should not have existing report in JSON format at startup of test', function (done) {

            confirmReportArtifactDoesNotExist( reportJSON, done );
        });

        it( 'should not have existing report in CSV format at startup of test', function (done) {

            confirmReportArtifactDoesNotExist( reportCSV, done );
        });

        it( 'should not have existing violations report at startup of test', function (done) {

            confirmReportArtifactDoesNotExist( violationsXML, done );
        });

        it( 'should not have existing bubble charts image in SVG format at startup of test', function (done) {

            confirmReportArtifactDoesNotExist( bubblesSVG, done );
        });

        it( 'should NOT throw an error if file is analyzed', function( done ) {
            process.env.NODE_ENV = 'testing';
            phpmetrix( args, function( err, stdout, stderr ) {
                done( err );
            });
        });

        it( 'should create a report in XML format', function ( done ) {
            ( fs.existsSync( reportXML )).should.be.true;
            done();
        });

        it( 'should create a report in HTML format', function ( done ) {
            ( fs.existsSync( reportHTML )).should.be.true;
            done();
        });

        it( 'should create a report in JSON format', function ( done ) {
            ( fs.existsSync( reportJSON )).should.be.true;
            done();
        });

        it( 'should create a report in CSV format', function ( done ) {
            ( fs.existsSync( reportCSV )).should.be.true;
            done();
        });

        it( 'should create an image of the bubbles charts in SVG format', function ( done ) {
            ( fs.existsSync( bubblesSVG )).should.be.true;
            done();
        });

        it( 'should create a report of violations in XML format', function ( done ) {
            ( fs.existsSync( violationsXML )).should.be.true;
            done();
        });

        it('should throw an error if config.yml does not exist', function( done ) {
            process.env.NODE_ENV = 'testing';
            var testArgs = args;

            // Change the first argument to a config file that doesn't exist
            testArgs[0] = '--config='+nonConfigFilePath;

            phpmetrix( testArgs, function( err, stdout, stderr ) {
                ( err !== undefined ).should.be.true;
                done();
            });
        });
    });

    describe( 'cli', function() {

        var initialArgs = process.argv;

        before( function() {

            unlinkExistingArtifact( reportXML );
            unlinkExistingArtifact( reportHTML );
            unlinkExistingArtifact( reportJSON );
            unlinkExistingArtifact( reportCSV );
            unlinkExistingArtifact( violationsXML );
            unlinkExistingArtifact( bubblesSVG );
        });

        after( function( done ) {
            process.argv = initialArgs;
            done();
        });

        it( 'should be exectuable', function(done) {
            binCheck(__dirname + '../cli.js', ['--version']).then( function( works ) {
                works.should.equal( true );
            });
            done();
        });

        it( 'should throw an error when config.yml does not exist', function( done ) {
            process.env.NODE_ENV = 'testing';
            var tempArgs = args;

            // Change the first argument to a config file that doesn't exist
            tempArgs[0] = '--config='+nonConfigFilePath;

            cli( tempArgs, function( err ) {
                (err !== undefined).should.be.true;
            });
            done();
        });

        it( 'should NOT throw an error when config.yml exists', function( done ) {
            process.env.NODE_ENV = 'testing';
            cli( args, function( err ) {
                (err === undefined).should.be.true;
            });
            done();
        });

        it( 'should create a report in XML format', function ( done ) {
            ( fs.existsSync( reportXML )).should.be.true;
            done();
        });

        it( 'should create a report in HTML format', function ( done ) {
            ( fs.existsSync( reportHTML )).should.be.true;
            done();
        });

        it( 'should create a report in JSON format', function ( done ) {
            ( fs.existsSync( reportJSON )).should.be.true;
            done();
        });

        it( 'should create a report in CSV format', function ( done ) {
            ( fs.existsSync( reportCSV )).should.be.true;
            done();
        });

        it( 'should create an image of the bubbles charts in SVG format', function ( done ) {
            ( fs.existsSync( bubblesSVG )).should.be.true;
            done();
        });

        it( 'should create a report of violations in XML format', function ( done ) {
            ( fs.existsSync( violationsXML )).should.be.true;
            done();
        });
    });
});
