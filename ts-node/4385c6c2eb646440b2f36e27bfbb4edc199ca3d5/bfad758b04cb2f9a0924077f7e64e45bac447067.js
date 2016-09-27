"use strict";
var yargs_1 = require('yargs');
var CONFIG = require('../../config');
function templateLocals() {
    var configEnvName = yargs_1.argv['config-env'] || 'dev';
    var configEnv = CONFIG.getPluginConfig('environment-config')[configEnvName];
    if (!configEnv) {
        throw new Error('Invalid configuration name');
    }
    var config = {
        ENV_CONFIG: JSON.stringify(configEnv)
    };
    return Object.assign(config, CONFIG);
}
exports.templateLocals = templateLocals;
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/bfad758b04cb2f9a0924077f7e64e45bac447067.js.map