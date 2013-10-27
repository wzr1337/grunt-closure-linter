# grunt-closure-linter

> Google closure linting

## Getting Started
This plugin requires Grunt `~0.4.0rc7`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-closure-linter --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-closure-linter');
```

## The "closure_linter" task

### Overview
In your project's Gruntfile, add a section named `closureLint` and/or `closureFixStyle` to the data object passed into `grunt.initConfig()`.

Use the command attribute to point to a specific command if yours has not the default name.

```js
grunt.initConfig({
  closureLint: {
    app:{
      closureLinterPath : '/path/to/closure_linter/folder',
      command: 'gjslint',
      src: [ 'app/scripts/controllers/**',
             'app/scripts/services/**',
             'app/scripts/app.js' ],
      options: {
        stdout: true,
        strict: true
      }
    }
  },
  closureFixStyle: {
    app:{
      closureLinterPath : '/path/to/closure_linter/folder',
      command: 'fixjsstyle',
      src: [ 'app/scripts/controllers/**',
             'app/scripts/services/**',
             'app/scripts/app.js' ],
      options: {
        stdout: true,
        strict: true
      }
    }
  }
})
```

### Options

#### options.stdout
Type: `mixed`
Default value: `false`

- `true` – write results to stdout;
- `string` – write results to file specified;
- `false` – do not write anything.

#### options.stderr
Type: `Boolean`
Default value: `false`

Pipe errors to stderr.

#### options.failOnError
Type: `Boolean`
Default value: `true`

Fail task on errors.

#### options.strict
Type: `Boolean`
Default value: `false`

Use strict mode.

#### options.reporter
Type: `string`
Default value: `'closure'`

Reporter type. Possible values are: `'closure'`, `'jslint'`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_0.0.1_ Initial revision
