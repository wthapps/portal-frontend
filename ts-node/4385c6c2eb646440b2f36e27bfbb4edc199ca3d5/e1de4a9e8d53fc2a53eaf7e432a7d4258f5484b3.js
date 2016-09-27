"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path_1 = require('path');
var seed_config_1 = require('./seed.config');
var ProjectConfig = (function (_super) {
    __extends(ProjectConfig, _super);
    function ProjectConfig() {
        _super.call(this);
        this.PROJECT_TASKS_DIR = path_1.join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
        this.NPM_DEPENDENCIES = this.NPM_DEPENDENCIES.concat([
            { src: 'lodash/lodash.min.js', inject: 'libs' }
        ]);
        this.APP_ASSETS = this.APP_ASSETS.concat([
            { src: this.ASSETS_SRC + "/dist/app.min.js", inject: true, vendor: false }
        ]);
    }
    return ProjectConfig;
}(seed_config_1.SeedConfig));
exports.ProjectConfig = ProjectConfig;
//# sourceMappingURL=/home/phat/SourceCode/portal-frontend/ts-node/4385c6c2eb646440b2f36e27bfbb4edc199ca3d5/e1de4a9e8d53fc2a53eaf7e432a7d4258f5484b3.js.map