## phpmetrix

> phpmetrix is a node wrapper around phpmetrics that provides integration with build systems like
> [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/) and more.

[![npm](http://img.shields.io/npm/v/phplint.svg?style=flat)](https://www.npmjs.com/package/phplint)
[![Build Status](https://travis-ci.org/dcarrith/phpmetrix.svg?branch=master)](https://travis-ci.org/dcarrith/phpmetrix)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Dependency Status](https://david-dm.org/wayneashleyberry/phpmetrics/status.svg?style=flat)](https://david-dm.org/wayneashleyberry/phplint#info=dependencies)
[![devDependency Status](https://david-dm.org/wayneashleyberry/phplint/dev-status.svg?style=flat)](https://david-dm.org/wayneashleyberry/phplint#info=devDependencies)

## Usage

### CLI

```sh
$ npm i -g phpmetrix
$ phpmetrix path/to/config.yml
```

### Node

```js
var phpmetrix = require('phpmetrix').phpmetrix

phpmetrix(['path/to/config.yml'], function (err, stdout, stderr) {
  if (err) throw new Error(err)

  process.stdout.write(stdout)
  process.stderr.write(stderr)

  // success!
})
```

### NPM

```json
{
  "scripts": {
    "pretest": "phpmetrix path/to/config.yml"
  },
  "devDependencies": { }
}
```

```sh
$ npm test
```

### Grunt


```js
module.exports = function (grunt) {
  require('phpmetrix').gruntPlugin(grunt)

  grunt.initConfig({
    phpmetrix: {
      config: 'path/to/config.yml',
      options: {
        phpCmd: '/usr/local/bin/php', // Defaults to php
        phpCmd: '/usr/local/bin/phpmetrics', // Defaults to phpmetrics
        stdout: true,
        stderr: true
      }
    }
  })

  grunt.registerTask('test', ['phpmetrix'])

}
```

```sh
$ grunt test
```

### Gulp

The same options that can be used in Grunt can be used in Gulp too.

```js
var gulp = require('gulp')
var phpmetrics = require('phpmetrix').phpmetrics

gulp.task('phpmetrix', function (cb) {
  phpmetrix(['path/to/config.yml'], function (err, stdout, stderr) {
    if (err) {
      cb(err)
      process.exit(1)
    }
    cb()
  })
})

gulp.task('test', ['phpmetrix'])
```

```sh
$ gulp test
```

#### License

[MIT](http://opensource.org/licenses/MIT) © [David Carrithers](https://github.com/dcarrith)
