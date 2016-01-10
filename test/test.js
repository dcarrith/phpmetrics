/* global describe, it, before, after */
'use strict'

var chai = require('chai')
var wrapper = require('../')
var binCheck = require('bin-check')
var phpmetrics = wrapper.phpmetrics
var cli = wrapper.cli

var configFilePath = __dirname + '/config.yml'
var nonConfigFilePath = __dirname + '/nonconfig.yml'

chai.should()

describe('phpmetrics', function () {
  after(function (done) {
    wrapper.clearCache(done)
  })

  describe('using Node', function () {
    it('should NOT throw an error if file is analyzed', function (done) {
      phpmetrics([configFilePath], function (err, stdout, stderr) {
        done(err || stderr)
      })
    })

    it('should throw an error if config.yml does not exist', function (done) {
      phpmetrics([nonConfigFilePath], function (err, stdout, stderr) {
        (err !== undefined).should.be.true

        done()
      })
    })
  })

  describe('cli', function () {
    var initialArgs = process.argv

    before(function (done) {
      process.argv = ['phpmetrics']

      done()
    })

    after(function (done) {
      process.argv = initialArgs

      done()
    })

    it('should be exectuable', function (done) {
      binCheck(__dirname + '/../cli.js').then(function (works) {
        console.log('bin-check', works)
        works.should.equal(true)
        done()
      })
    })

    it('should throw an error when config.yml does not exist', function (done) {
      cli([nonConfigFilePath], {}, function (err) {
        (err !== undefined).should.be.true

        done()
      })
    })

    it('should not throw an error when config.yml does exist', function (done) {
      cli([configFilePath], {}, function () {
        done()
      })
    })
  })
})
