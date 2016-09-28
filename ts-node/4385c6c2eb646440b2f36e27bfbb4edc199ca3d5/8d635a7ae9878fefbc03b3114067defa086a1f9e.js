"use strict";
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var path_1 = require('path');
var slash = require('slash');
var config_1 = require('../../config');
var utils_1 = require('../../utils');
var plugins = gulpLoadPlugins();
function inject(name) {
    return plugins.inject(gulp.src(getInjectablesDependenciesRef(name), { read: false }), {
        name: name,
        transform: transformPath()
    });
}
function getInjectablesDependenciesRef(name) {
    return config_1.DEPENDENCIES
        .filter(function (dep) { return dep['inject'] && dep['inject'] === (name || true); })
        .map(mapPath);
}
function mapPath(dep) {
    var envPath = dep.src;
    if (envPath.startsWith(config_1.APP_SRC) && !envPath.endsWith('.scss')) {
        envPath = path_1.join(config_1.APP_DEST, envPath.replace(config_1.APP_SRC, ''));
    }
    else if (envPath.startsWith(config_1.APP_SRC) && envPath.endsWith('.scss')) {
        envPath = envPath.replace(config_1.ASSETS_SRC, config_1.CSS_DEST).replace('.scss', '.css');
    }
    return envPath;
}
function transformPath() {
    return function (filepath) {
        arguments[0] = path_1.join(config_1.APP_BASE, filepath) + ("?" + Date.now());
        return slash(plugins.inject.transform.apply(plugins.inject.transform, arguments));
    };
}
module.exports = function () {
    return gulp.src(path_1.join(config_1.APP_SRC, 'index.html'))
        .pipe(inject('shims'))
        .pipe(inject('libs'))
        .pipe(inject())
        .pipe(plugins.template(utils_1.templateLocals()))
        .pipe(gulp.dest(config_1.APP_DEST));
};
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/8d635a7ae9878fefbc03b3114067defa086a1f9e.js.map