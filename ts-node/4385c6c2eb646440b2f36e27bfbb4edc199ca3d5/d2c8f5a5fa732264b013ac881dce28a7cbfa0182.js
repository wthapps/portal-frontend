"use strict";
var browserSync = require('browser-sync');
var config_1 = require('../../config');
var runServer = function () {
    browserSync.init(config_1.getPluginConfig('browser-sync'));
};
var listen = function () {
    runServer();
};
exports.listen = listen;
var changed = function (files) {
    if (!(files instanceof Array)) {
        files = [files];
    }
    browserSync.reload(files);
};
exports.changed = changed;
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/d2c8f5a5fa732264b013ac881dce28a7cbfa0182.js.map