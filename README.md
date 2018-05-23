# AccessSniff Extended
[![Build Status](https://travis-ci.org/prantlf/AccessSniff.svg?branch=master)](https://travis-ci.org/prantlf/AccessSniff)
[![codecov](https://codecov.io/gh/prantlf/AccessSniff/branch/combined/graph/badge.svg)](https://codecov.io/gh/prantlf/AccessSniff)


A CLI, JsDom and PhantomJs library for HTML_CodeSniffer

This fork writes the report, even if errors are detected in input files.

- [Gulp plugin](https://github.com/prantlf/gulp-accessibility)
- [Grunt plugin](https://github.com/prantlf/grunt-accessibility)

![Example Image](img/example.png)

## Getting Started
Install this plugin with `npm install access-sniff-ext --save`

### ES5
```js
var AccessSniff = require('access-sniff-ext');

AccessSniff
  .default(['**/*.html'], options)
  .then(function(report) {
    AccessSniff.report(report, reportOptions);
  });
```

### ES6
```js
import AccessSniff, { reports as AccessReports } from 'access-sniff-ext';

AccessSniff(['**/*.html'], options)
  .then(report => AccessReports(report, reportOptions));
```


### CLI
```
npm install access-sniff-ext -g
sniff test/**/*.html -r json -l reports
```

AccessSniff can test both locally hosted files and websites.

```
sniff http://statamic.com/ -r json -l reports
```

## Options
You can pass the following options

### Accessibility Level

`accessibilityLevel` is a string

```js
options: {
  accessibilityLevel: 'WCAG2A'
}
```

Levels are `WCAG2A`, `WCAG2AA`, `WCAG2AAA`, and `Section508`

### Accessibilityrc

You can create an .accessibilityrc file in your project to set options:

```json
{
  "ignore": [
    "WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl",
    "WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2"
  ]
}
```

### Ignore By Rule Identifier

`ignore` is an array

You can ignore rules by placing them in an array outlined below.

```js
options: {
  ignore: [
    'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl'
    'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
  ]
}
```

Rules will also match to remove and entire set.

`WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1` will ignore `WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl`

### Ignore By Other Information

`ignoreByDescription`, `ignoreByElement`, `ignoreByClass` and `ignoreById`
are arrays

You can ignore rules by including their description, element content, CSS
class or HTML ID in their full as string, or by including regular expression
matching their textual value. This can be useful to ignore only some
problem occurrences, which are "false positives", while retaining the other
checks done by the same rule.

```js
options: {
  ignoreByDescription: [
    'This form field should be labelled in some way. Use the label element ' +
    '(either with a "for" attribute or wrapped around the form field), or ' +
    '"title", "aria-label" or "aria-labelledby" attributes as appropriate.',
    /^This element has a role of "\w+" but does not have a name available to an accessibility API\. Valid names are: [^.]+\.$/
  ],
  ignoreByElement: [
    /^<a id="herpDerp" class="[^"]*" href="test">Test<\/a>$/
  ],
  ignoreByClass: [
    /\bcustom-checkbox\b/
  ],
  ignoreById: [
    'select-all'
  ]
}
```

### Error levels

`errorLevels` is an object

```js
  options: {
    errorLevels: {
      notice: false,
      warning: false,
      error: true
    }
  }
```

If an issue of a certain level is found and this level is flagged by `true`
in `errorLevels`, validation will fail

### Verbose output

`verbose` is a boolean

```js
options: {
  verbose: false
}
```

Output messages to console, set to true by default

### Force

`force` is a boolean, defaults to `false`

```js
options: {
  force: true
}
```

Continue running in the event of failures.
You can catch failures from the promise as below:
```js
AccessSniff(['**/*.html'], options)
.then(report => AccessReports(report, reportOptions));
.catch(error => console.error(error))
```

### Browser

`browser` is a boolean, defaults to `false`

```js
options: {
  browser: false
}
```

AccessSniff uses jsDom as the default, setting this to true will use PhantomJs instead

### maxBuffer

`maxBuffer` is a number, defaults to `500*1024`

In certain situations you might have to increase the memory allocated to render a page.

```js
options: {
  maxBuffer: 500*1024
}
```

## Reports
You can pass the following options to the report generator

#### Notes
- Reports are now generated from the returned json to the report module
- Report location is required to write a report
- Reports return the content from the report

### Modular Reporting
You can use the inbuilt system or create your own
```js
AccessSniff.report(report, reportOptions)
```

### Report Type

`reportType` is a string
```js
options: {
  reportType: 'json'
}
```

Text, CSV or JSON format output

- `txt` will output text files
- `json` will output .json files
- `csv` will output csv

### Report Location

`reportLocation` is a string

```js
  options: {
    reportLocation: 'reports'
  }
```

Set the value to where you want reports created

### Report Levels

`reportLevels` is an object

```js
  options: {
    reportLevels: {
      notice: true,
      warning: true,
      error: true
    }
  }
```

Set a value to `false` to limit output

## CLI
You can use the CLI component by installing it globally with `npm install -g access-sniff-ext`

```cmd
sniff test/**/*.html -r json -l reports
sniff test/**/*.html -r csv -l reports
sniff test/**/*.html -r txt -l reports
```

### Options

#### Error Levels
`-e` or `-errorLevels`

Combination of comma-delimited error, warning and notice.

#### Report Type
`-r` or `-reportType`

txt, csv, json.

#### Report Location
`-r` or `-reportLocation`

#### Force
`-f` or `-force`

#### Quiet
`-q` or `-quiet`
