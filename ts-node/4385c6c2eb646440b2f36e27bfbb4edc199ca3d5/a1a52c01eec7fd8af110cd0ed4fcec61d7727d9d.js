"use strict";
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var merge = require('merge-stream');
var util = require('gulp-util');
var path_1 = require('path');
var config_1 = require('../../config');
var plugins = gulpLoadPlugins();
var cleanCss = require('gulp-clean-css');
var gulpConcatCssConfig = config_1.getPluginConfig('gulp-concat-css');
var processors = [
    autoprefixer({
        browsers: config_1.BROWSER_LIST
    })
];
var reportPostCssError = function (e) { return util.log(util.colors.red(e.message)); };
var isProd = config_1.ENV === 'prod';
if (isProd) {
    processors.push(cssnano({
        discardComments: { removeAll: true },
        discardUnused: false,
        zindex: false,
        reduceIdents: false
    }));
}
function prepareTemplates() {
    return gulp.src(path_1.join(config_1.APP_SRC, '**', '*.html'))
        .pipe(gulp.dest(config_1.TMP_DIR));
}
function processComponentStylesheets() {
    return config_1.ENABLE_SCSS ? processComponentScss() : processComponentCss();
}
function processComponentScss() {
    return gulp.src(path_1.join(config_1.APP_SRC, '**', '*.scss'))
        .pipe(isProd ? plugins.cached('process-component-scss') : plugins.util.noop())
        .pipe(isProd ? plugins.progeny() : plugins.util.noop())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass(config_1.getPluginConfig('gulp-sass')).on('error', plugins.sass.logError))
        .pipe(plugins.postcss(processors))
        .on('error', reportPostCssError)
        .pipe(plugins.sourcemaps.write(isProd ? '.' : ''))
        .pipe(gulp.dest(isProd ? config_1.TMP_DIR : config_1.APP_DEST));
}
function processComponentCss() {
    return gulp.src([
        path_1.join(config_1.APP_SRC, '**', '*.css'),
        '!' + path_1.join(config_1.APP_SRC, 'assets', '**', '*.css')
    ])
        .pipe(isProd ? plugins.cached('process-component-css') : plugins.util.noop())
        .pipe(plugins.postcss(processors))
        .on('error', reportPostCssError)
        .pipe(gulp.dest(isProd ? config_1.TMP_DIR : config_1.APP_DEST));
}
function processExternalStylesheets() {
    return config_1.ENABLE_SCSS ? processAllExternalStylesheets() : processExternalCss();
}
function processAllExternalStylesheets() {
    return merge(getExternalCssStream(), getExternalScssStream())
        .pipe(isProd ? plugins.concatCss(gulpConcatCssConfig.targetFile, gulpConcatCssConfig.options) : plugins.util.noop())
        .pipe(plugins.postcss(processors))
        .on('error', reportPostCssError)
        .pipe(isProd ? cleanCss() : plugins.util.noop())
        .pipe(gulp.dest(config_1.CSS_DEST));
}
function getExternalCssStream() {
    return gulp.src(getExternalCss())
        .pipe(isProd ? plugins.cached('process-external-css') : plugins.util.noop());
}
function getExternalCss() {
    return config_1.DEPENDENCIES.filter(function (dep) { return /\.css$/.test(dep.src); }).map(function (dep) { return dep.src; });
}
function getExternalScssStream() {
    return gulp.src(getExternalScss())
        .pipe(isProd ? plugins.cached('process-external-scss') : plugins.util.noop())
        .pipe(isProd ? plugins.progeny() : plugins.util.noop())
        .pipe(plugins.sass(config_1.getPluginConfig('gulp-sass')).on('error', plugins.sass.logError));
}
function getExternalScss() {
    return config_1.DEPENDENCIES.filter(function (dep) { return /\.scss$/.test(dep.src); }).map(function (dep) { return dep.src; })
        .concat([path_1.join(config_1.CSS_SRC, '**', '*.scss')]);
}
function processExternalCss() {
    return getExternalCssStream()
        .pipe(plugins.postcss(processors))
        .pipe(isProd ? plugins.concatCss(gulpConcatCssConfig.targetFile, gulpConcatCssConfig.options) : plugins.util.noop())
        .on('error', reportPostCssError)
        .pipe(isProd ? cleanCss() : plugins.util.noop())
        .pipe(gulp.dest(config_1.CSS_DEST));
}
module.exports = function () { return merge(processComponentStylesheets(), prepareTemplates(), processExternalStylesheets()); };
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/a1a52c01eec7fd8af110cd0ed4fcec61d7727d9d.js.map