/* global describe, it, before, after */
'use strict'

var Q = require('q');
var fs = require('fs');
var chai = require('chai');
var wrapper = require('../');
var binCheck = require('bin-check');
var phpmetrix = wrapper.phpmetrix;
var cli = wrapper.cli;

var configFilePath = __dirname + '/config.yml';
var nonConfigFilePath = __dirname + '/nonconfig.yml';

chai.should();

describe('phpmetrix', function () {

    var reportXML       = __dirname + '/reports/phpmetrics.xml';
    var reportHTML      = __dirname + '/reports/phpmetrics.html';
    var reportCSV       = __dirname + '/reports/phpmetrics.csv';
    var violationsXML   = __dirname + '/reports/violations.xml';
    var bubblesSVG      = __dirname + '/reports/bubbles.svg';

    describe( 'using Node', function() {

        before( function() {

            if( fs.exists( reportXML )) {

                fs.unlink( reportXML, function( err ) {
                    if ( err ) throw err;
                });
            }

            if( fs.exists( reportHTML )) {

                fs.unlink( reportHTML, function( err ) {
                    if ( err ) throw err;
                });
            }

            if( fs.exists( reportCSV )) {

               fs.unlink( reportCSV, function( err ) {
                    if ( err ) throw err;
                });
            }

            if( fs.exists( violationsXML )) {

                fs.unlink( violationsXML, function( err ) {
                    if ( err ) throw err;
                });
            }

            if( fs.exists( bubblesSVG )) {

                fs.unlink( bubblesSVG, function( err ) {
                    if ( err ) throw err;
                });
            }
        });

        it( 'should not have existing report in XML format at startup of test', function (done) {

            try
            {
                // This actually throws an error when the file does not exist
                ( fs.statSync( reportXML ).isFile() ).should.be.false;
            }
            catch (err)
            {
                // Now, we can actually run the test to confirm
                ( err !== 'undefined' ).should.be.true;
            }

            done();
        });

        it( 'should not have existing report in HTML format at startup of test', function (done) {

            try
            {
                // This actually throws an error when the file does not exist
                ( fs.statSync( reportHTML ).isFile() ).should.be.false;
            }
            catch (err)
            {
                // Now, we can actually run the test to confirm
                ( err !== 'undefined' ).should.be.true;
            }

            done();
        });

        it( 'should not have existing report in CSV format at startup of test', function (done) {

            try
            {
                // This actually throws an error when the file does not exist
                ( fs.statSync( reportCSV ).isFile() ).should.be.false;
            }
            catch (err)
            {
                // Now, we can actually run the test to confirm
                ( err !== 'undefined' ).should.be.true;
            }

            done();
        });

        it( 'should not have existing violations report at startup of test', function (done) {

            try
            {
                // This actually throws an error when the file does not exist
                ( fs.statSync( violationsXML ).isFile() ).should.be.false;
            }
            catch (err)
            {
                // Now, we can actually run the test to confirm
                ( err !== 'undefined' ).should.be.true;
            }

            done();
        });

        it( 'should not have existing bubble charts image in SVG format at startup of test', function (done) {

            try
            {
                // This actually throws an error when the file does not exist
                ( fs.statSync( bubblesSVG ).isFile() ).should.be.false;
            }
            catch (err)
            {
                // Now, we can actually run the test to confirm
                ( err !== 'undefined' ).should.be.true;
            }

            done();
        });

        it( 'should NOT throw an error if file is analyzed', function( done ) {
            phpmetrix( configFilePath, function( err, stdout, stderr ) {
                done( err );
            });
        });

        it( 'should create a report in xml format', function ( done ) {
            ( fs.existsSync( reportXML )).should.be.true;
            done();
        });

        it( 'should create a report in html format', function ( done ) {
            ( fs.existsSync( reportHTML )).should.be.true;
            done();
        });

        it( 'should create a report in csv format', function ( done ) {
            ( fs.existsSync( reportCSV )).should.be.true;
            done();
        });

        it( 'should create an image of the bubbles charts in svg format', function ( done ) {
            ( fs.existsSync( bubblesSVG )).should.be.true;
            done();
        });

        it( 'should create a report of violations in xml format', function ( done ) {
            ( fs.existsSync( violationsXML )).should.be.true;
            done();
        });

        it('should throw an error if config.yml does not exist', function( done ) {
            phpmetrix( nonConfigFilePath, function( err, stdout, stderr ) {
                ( err !== undefined ).should.be.true;
                done();
            });
        });
    });

    describe( 'cli', function() {

        var initialArgs = process.argv;

        before( function() {

            if( fs.exists( reportXML )) {

                fs.unlink( reportXML, function( err ) {
                    if ( err ) throw err;
                });
            }

            if( fs.exists( reportHTML )) {

                fs.unlink( reportHTML, function( err ) {
                    if ( err ) throw err;
                });
            }

            if( fs.exists( reportCSV )) {

               fs.unlink( reportCSV, function( err ) {
                    if ( err ) throw err;
                });
            }

            if( fs.exists( violationsXML )) {

                fs.unlink( violationsXML, function( err ) {
                    if ( err ) throw err;
                });
            }

            if( fs.exists( bubblesSVG )) {

                fs.unlink( bubblesSVG, function( err ) {
                    if ( err ) throw err;
                });
            }
        });

        after( function( done ) {
            process.argv = initialArgs;
            done();
        });

        it('should be exectuable', function( done ) {
            binCheck(__dirname + '../cli.js', ['--version']).then( function( works ) {
                works.should.equal( true );
            });
            done();
        });

        it('should throw an error when config.yml does not exist', function (done) {
            cli(nonConfigFilePath, {}, function (err) {
                (err !== undefined).should.be.true;
            });
            done();
        });

        it('should NOT throw an error when config.yml exists', function (done) {
            cli(configFilePath, {}, function (err) {
                (err === undefined).should.be.true;
            });
            done();
        });

        it( 'should create a report in xml format', function ( done ) {
            ( fs.existsSync( reportXML )).should.be.true;
            done();
        });

        it( 'should create a report in html format', function ( done ) {
            ( fs.existsSync( reportHTML )).should.be.true;
            done();
        });

        it( 'should create a report in csv format', function ( done ) {
            ( fs.existsSync( reportCSV )).should.be.true;
            done();
        });

        it( 'should create an image of the bubbles charts in svg format', function ( done ) {
            ( fs.existsSync( bubblesSVG )).should.be.true;
            done();
        });

        it( 'should create a report of violations in xml format', function ( done ) {
            ( fs.existsSync( violationsXML )).should.be.true;
            done();
        });
    });
});
