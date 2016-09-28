"use strict";
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var merge = require('merge-stream');
var util = require('gulp-util');
var path_1 = require('path');
var config_1 = require('../../config');
var utils_1 = require('../../utils');
var plugins = gulpLoadPlugins();
var typedBuildCounter = config_1.TYPED_COMPILE_INTERVAL;
module.exports = function () {
    var tsProject;
    var typings = gulp.src([
        'typings/index.d.ts',
        config_1.TOOLS_DIR + '/manual_typings/**/*.d.ts'
    ]);
    var src = [
        path_1.join(config_1.APP_SRC, '**/*.ts'),
        '!' + path_1.join(config_1.APP_SRC, '**/*.spec.ts'),
        '!' + path_1.join(config_1.APP_SRC, '**/*.e2e-spec.ts')
    ];
    var projectFiles = gulp.src(src);
    var result;
    var isFullCompile = true;
    if (typedBuildCounter < config_1.TYPED_COMPILE_INTERVAL) {
        isFullCompile = false;
        tsProject = utils_1.makeTsProject({ isolatedModules: true });
        projectFiles = projectFiles.pipe(plugins.cached());
        util.log('Performing typeless TypeScript compile.');
    }
    else {
        tsProject = utils_1.makeTsProject();
        projectFiles = merge(typings, projectFiles);
    }
    result = projectFiles
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript(tsProject))
        .on('error', function () {
        typedBuildCounter = config_1.TYPED_COMPILE_INTERVAL;
    });
    if (isFullCompile) {
        typedBuildCounter = 0;
    }
    else {
        typedBuildCounter++;
    }
    return result.js
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.template(utils_1.templateLocals()))
        .pipe(gulp.dest(config_1.APP_DEST));
};
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/3b12513df72f9d7f6b8cec0be3d60a60d0d91130.js.map