"use strict";
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var tsProjects = {};
function makeTsProject(options) {
    if (options === void 0) { options = {}; }
    var optionsHash = JSON.stringify(options);
    if (!tsProjects[optionsHash]) {
        var config = Object.assign({
            typescript: require('typescript')
        }, options);
        tsProjects[optionsHash] = plugins.typescript.createProject('tsconfig.json', config);
    }
    return tsProjects[optionsHash];
}
exports.makeTsProject = makeTsProject;
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/e123c4b630ce12beb3c07a76fcfd0eda099f8602.js.map