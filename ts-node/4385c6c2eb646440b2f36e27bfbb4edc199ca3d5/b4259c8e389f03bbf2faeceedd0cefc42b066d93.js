"use strict";
var gulpLoadPlugins = require('gulp-load-plugins');
var path_1 = require('path');
var runSequence = require('run-sequence');
var config_1 = require('../../config');
var utils_1 = require('../../utils');
var plugins = gulpLoadPlugins();
function watch(taskname) {
    return function () {
        var paths = [
            path_1.join(config_1.APP_SRC, '**')
        ].concat(config_1.TEMP_FILES.map(function (p) { return '!' + p; }));
        plugins.watch(paths, function (e) {
            return runSequence(taskname, function () { return utils_1.notifyLiveReload(e); });
        });
    };
}
exports.watch = watch;
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/b4259c8e389f03bbf2faeceedd0cefc42b066d93.js.map