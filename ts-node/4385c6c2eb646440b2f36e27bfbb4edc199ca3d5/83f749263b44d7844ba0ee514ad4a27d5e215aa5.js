"use strict";
var gulp = require('gulp');
var util = require('gulp-util');
var runSequence = require('run-sequence');
var config_1 = require('./tools/config');
var utils_1 = require('./tools/utils');
utils_1.loadTasks(config_1.SEED_TASKS_DIR);
utils_1.loadTasks(config_1.PROJECT_TASKS_DIR);
gulp.task('build.dev', function (done) {
    return runSequence('build.assets.dev', 'build.html_css', 'build.js.dev', 'build.index.dev', done);
});
gulp.task('build.dev.watch', function (done) {
    return runSequence('build.dev', 'watch.dev', done);
});
gulp.task('build.e2e', function (done) {
    return runSequence('clean.dev', 'tslint', 'build.assets.dev', 'build.js.e2e', 'build.index.dev', done);
});
gulp.task('build.prod', function (done) {
    return runSequence('clean.prod', 'tslint', 'build.assets.prod', 'build.html_css', 'copy.js.prod', 'build.js.prod', 'build.bundles', 'build.bundles.app', 'build.index.prod', done);
});
gulp.task('build.test', function (done) {
    return runSequence('clean.once', 'tslint', 'build.assets.dev', 'build.html_css', 'build.js.dev', 'build.js.test', 'build.index.dev', done);
});
gulp.task('build.test.watch', function (done) {
    return runSequence('build.test', 'watch.test', done);
});
gulp.task('build.tools', function (done) {
    return runSequence('clean.tools', 'build.js.tools', done);
});
gulp.task('serve.dev', function (done) {
    return runSequence('build.dev', 'server.start', 'watch.dev', done);
});
gulp.task('serve.e2e', function (done) {
    return runSequence('build.e2e', 'server.start', 'watch.e2e', done);
});
gulp.task('serve.prod', function (done) {
    return runSequence('build.prod', 'server.prod', done);
});
gulp.task('test', function (done) {
    return runSequence('build.test', 'karma.start', done);
});
var firstRun = true;
gulp.task('clean.once', function (done) {
    if (firstRun) {
        firstRun = false;
        runSequence('clean.dev', 'clean.coverage', done);
    }
    else {
        util.log('Skipping clean on rebuild');
        done();
    }
});
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/83f749263b44d7844ba0ee514ad4a27d5e215aa5.js.map