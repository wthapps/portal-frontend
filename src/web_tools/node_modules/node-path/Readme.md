# node-path
This is module is a simple hack to allow old `require.paths` deprecated method.

## Install

`$ npm install node-path`

## Usage

```javascript
// On process.mainModule; eg: node index.js
require('node-path')(module, ['../libs', '../vendor']);

// On a child module
require('node-path')(module);

var myLib = require('my-lib-in-libs');
var myVendor = require('my-vendor-in-vendors');
```

## Todo

* Add some tests
* Improve extend method

## Licence

MIT