"use strict";
var gulp = require('gulp');
var path_1 = require('path');
var config_1 = require('../../config');
module.exports = function () {
    var paths = [
        path_1.join(config_1.APP_SRC, '**'),
        '!' + path_1.join(config_1.APP_SRC, '**', '*.ts'),
        '!' + path_1.join(config_1.APP_SRC, '**', '*.scss')
    ].concat(config_1.TEMP_FILES.map(function (p) { return '!' + p; }));
    return gulp.src(paths)
        .pipe(gulp.dest(config_1.APP_DEST));
};
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/4f0d05bfc8b5f5defeef507cfd4cb4f146b0bb9e.js.map