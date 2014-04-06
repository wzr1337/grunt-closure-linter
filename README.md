# grunt-closure-linter

> Google closure linting

## Getting Started
This plugin requires Grunt `~0.4.3`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-closure-linter --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-closure-linter');
```

## The "closureLint" and "closureFixStyle" tasks

### Prerequisites
In order to run the "closureLint" or "closureFixStyle" tasks you've to globally install the [Closure Linter](https://developers.google.com/closure/utilities/). For advanced usage you can also directly reference the Closure Linter folder. In this case you might need a wrapper for the `gjslint.py` and `fixjsstyle.py` scripts or otherwise python will fail with an import error.

If you haven't installed the python setuptools yet, you may install them with this command:
```shell
wget https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py -O - | sudo python
```

Install the Closure Linter ([download](https://code.google.com/p/closure-linter/downloads/list)) with this command:
```shell
cd path/to/closure_linter  # extracted from the closure_linter-latest.tar.gz
sudo python setup.py install

# Test installation
gjslint  # Should echo "0 files checked, no errors found."
```

### Overview
In your project's Gruntfile, add a section named `closureLint` and/or `closureFixStyle` to the data object passed into `grunt.initConfig()`.

Use the command attribute to point to a specific command if yours has not the default name.

```js
grunt.initConfig({
  closureLint: {
    options: {
      // [OPTIONAL] Use strict mode (default is false).
      strict: true
    },
    app:{
      src: [ 'app/scripts/controllers/**',
             'app/scripts/services/**',
             'app/scripts/app.js' ]
      // Also possible:
      // src: [ 'app/scripts' ]
    },
    // Example configuration using the jslint converter
    appConverter:{
      options: {
      	// [OPTIONAL] Use strict mode (default is false).
      	strict: true,
      	// Converts linter results into XML format
        converter: 'jslint'
      },
      src: [ 'app/scripts/controllers/**',
             'app/scripts/services/**',
             'app/scripts/app.js' ],
      dest: 'gjslint.log' // Writes linter result into dest file
    }
  },
  closureFixStyle: {
    options: {
      // [OPTIONAL] Use strict mode (default is false).
      strict: true
    },
    app:{
      src: [ 'app/scripts/controllers/**',
             'app/scripts/services/**',
             'app/scripts/app.js' ]
    }
  }
})
```

### Options

#### options.closureLinterPath
Type: `string`
Default value: `/usr/local/bin`

Path to the Closure Linter folder.

#### options.toolFile
Type: `string`

Tool file to be executed. In case of closureLinter task this defaults to `gjslint` and in case of closureFixStyle this defaults to `fixjsstyle`. You can also set e.g. `gjslint.py` as tool file in case you're directly referencing the Closure Linter folder.
This option makes only sense in combination with `closureLinterPath`.

#### options.stdout
Type: `Boolean`
Default value: `true`

Pipe output to stdout.

#### options.stderr
Type: `Boolean`
Default value: `true`

Pipe errors to stderr.

#### options.failOnError
Type: `Boolean`
Default value: `true`

Fail task on errors.

#### options.strict
Type: `Boolean`
Default value: `false`

Use strict mode.

#### options.maxLineLength
Type: `number`
Default value: `80`

Set the max line length.

#### options.converter
Type: `string`
Default value: `'closure'`

Converter type. Possible values are: `'closure'`, `'jslint'`. In case of `jslint` the linter result will be converted into a XML format and will be written to the `dest` file (see above example configuration for `closureFixStyle`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_0.2.0_ Rework of the Grunt Closure Linter

_0.0.1_ Initial revision
