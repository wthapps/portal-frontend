# Introduction

[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![Build Status](https://travis-ci.org/mgechev/angular-seed.svg?branch=master)](https://travis-ci.org/mgechev/angular2-seed)
[![Build Status](https://ci.appveyor.com/api/projects/status/github/mgechev/angular2-seed?svg=true)](https://ci.appveyor.com/project/mgechev/angular2-seed)
[![Join the chat at https://gitter.im/mgechev/angular2-seed](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mgechev/angular2-seed?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/mgechev/angular2-seed.svg)](https://david-dm.org/mgechev/angular2-seed)
[![devDependency Status](https://david-dm.org/mgechev/angular2-seed/dev-status.svg)](https://david-dm.org/mgechev/angular2-seed#info=devDependencies)

# How to start

**Note** that this seed project requires node v4.x.x or higher and npm 2.14.7.

**Here is how to [speed-up the build on Windows](https://github.com/mgechev/angular-seed/wiki/Speed-up-the-build-on-Windows)**.

In order to start the seed use:


```bash
git clone https://trungnghia112@bitbucket.org/WTHteam/portal-frontend.git
cd portal-frontend

# install the project's dependencies
npm install

# copy file dev.sample.ts to dev.ts
cp tools/env/dev.sample.ts ./dev.ts

# watches your files and uses livereload by default
npm start

# api document for the app
# npm run build.docs

# to start deving with livereload site and coverage as well as continuous testing
npm run start.deving

# dev build
npm run build.dev

# prod build
npm run build.prod

# prod build with AoT compilation
npm run build.prod.exp

# dev build of multiple applications (by default the value of --app is "app")
npm start -- --app baz
npm start -- --app foo
npm start -- --app bar
```

### For some Linux distributions (Debian/Ubuntu and RedHat/CentOS)

You need to modify the package.json (lines 23)


```
postinstall": "typings install && gulp check.versions && npm prune && gulp webdriver
```

to 

```
postinstall": "sudo typings install && gulp check.versions && npm prune && sudo gulp webdriver

```
### For some Linux distributions (Debian/Ubuntu and RedHat/CentOS)
You need to modify the package.json (lines 23)


```
postinstall": "typings install && gulp check.versions && npm prune && gulp webdriver
```

to 

```
postinstall": "sudo typings install && gulp check.versions && npm prune && sudo gulp webdriver

```


_Does not rely on any global dependencies._

# Configuration

Default application server configuration

```js
var PORT             = 3000;
var LIVE_RELOAD_PORT = 4002;
var DOCS_PORT        = 4003;
var APP_BASE         = '/';
```

Configure at runtime

```bash
npm start -- --port 8080 --reload-port 4000 --base /my-app/
```

## Environment configuration

If you have different environments and you need to configure them to use different end points, settings, etc. you can use the files `dev.ts` or `prod.ts` in`./tools/env/`. The name of the file is environment you want to use.

The environment can be specified by using:

```bash
npm start -- --config-env ENV_NAME
```

Currently the `ENV_NAME`s are `dev`, `prod`, `staging`, but you can simply add a different file `"ENV_NAME.ts".` file in order to alter extra such environments.


# List task
```bash
npm run tasks.list
```

# Task build develop to AWS
```bash
npm run build.dev.aws
```

# Task build production to AWS
```bash
npm run build.aws
```




# List task
```bash
npm run tasks.list
```

# Task build develop to AWS
```bash
npm run build.dev.aws
```

# Task build production to AWS
```bash
npm run build.aws
```

# Tools documentation

A documentation of the provided tools can be found in [tools/README.md](tools/README.md).

# How to extend?

Visit the [Wiki page](https://github.com/mgechev/angular-seed/wiki) of the project.

# Running tests

```bash
npm test

# Development. Your app will be watched by karma
# on each change all your specs will be executed.
npm run test.watch
# NB: The command above might fail with a "EMFILE: too many open files" error.
# Some OS have a small limit of opened file descriptors (256) by default
# and will result in the EMFILE error.
# You can raise the maximum of file descriptors by running the command below:
ulimit -n 10480


# code coverage (istanbul)
# auto-generated at the end of `npm test`
# view coverage report:
npm run serve.coverage

# e2e (aka. end-to-end, integration) - In three different shell windows
# Make sure you don't have a global instance of Protractor
# Make sure you do have Java in your PATH (required for webdriver)

# npm install webdriver-manager <- Install this first for e2e testing
# npm run webdriver-update <- You will need to run this the first time
npm run webdriver-start
npm run serve.e2e
npm run e2e

# e2e live mode - Protractor interactive mode
# Instead of last command above, you can use:
npm run e2e.live
```

# Documentation
Forks of this project demonstrate how to extend and integrate with other libraries:
[ng2-bootstrap](http://valor-software.com/ng2-bootstrap)
[ng2-bs3-modal](https://github.com/dougludlow/ng2-bs3-modal)


# Change Log

You can follow the [Angular change log here](https://github.com/angular/angular/blob/master/CHANGELOG.md).

# License

MIT