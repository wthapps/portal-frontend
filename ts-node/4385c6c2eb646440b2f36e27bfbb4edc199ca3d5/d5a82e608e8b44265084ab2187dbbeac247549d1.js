"use strict";
var express = require('express');
var fallback = require('express-history-api-fallback');
var openResource = require('open');
var path_1 = require('path');
var serveStatic = require('serve-static');
var codeChangeTool = require('./code_change_tools');
var config_1 = require('../../config');
function serveSPA() {
    codeChangeTool.listen();
}
exports.serveSPA = serveSPA;
function notifyLiveReload(e) {
    var fileName = e.path;
    codeChangeTool.changed(fileName);
}
exports.notifyLiveReload = notifyLiveReload;
function serveDocs() {
    var server = express();
    server.use(config_1.APP_BASE, serveStatic(path_1.resolve(process.cwd(), config_1.DOCS_DEST)));
    server.listen(config_1.DOCS_PORT, function () {
        return openResource('http://localhost:' + config_1.DOCS_PORT + config_1.APP_BASE);
    });
}
exports.serveDocs = serveDocs;
function serveCoverage() {
    var server = express();
    var compression = require('compression');
    server.use(compression());
    server.use(config_1.APP_BASE, serveStatic(path_1.resolve(process.cwd(), 'coverage')));
    server.listen(config_1.COVERAGE_PORT, function () {
        return openResource('http://localhost:' + config_1.COVERAGE_PORT + config_1.APP_BASE);
    });
}
exports.serveCoverage = serveCoverage;
function serveProd() {
    var root = path_1.resolve(process.cwd(), config_1.PROD_DEST);
    var server = express();
    var compression = require('compression');
    server.use(compression());
    server.use(config_1.APP_BASE, serveStatic(root));
    server.use(fallback('index.html', { root: root }));
    server.listen(config_1.PORT, function () {
        return openResource('http://localhost:' + config_1.PORT + config_1.APP_BASE);
    });
}
exports.serveProd = serveProd;
;
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/d5a82e608e8b44265084ab2187dbbeac247549d1.js.map