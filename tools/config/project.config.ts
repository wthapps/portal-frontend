import { join } from 'path';

import { SeedConfig } from './seed.config';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    // this.APP_TITLE = 'Put name of your app here';
    /************************* CUSTOM *************************/
    this.APP_TITLE = 'WTHApps';
    this.PORT = 3000;
    this.CSS_SRC = `${this.ASSETS_SRC}/css`;

    /************************* END CUSTOM *********************/
    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      {src: 'lodash/lodash.min.js', inject: 'libs'},
      {src: 'primeng/resources/primeng.min.css', inject: true},
      {src: 'primeng/resources/themes/bootstrap/theme.css', inject: true},
      {src: 'actioncable/lib/assets/compiled/action_cable.js', inject: 'libs'}
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      {src: `${this.ASSETS_SRC}/dist/app.min.js`, inject: true, vendor: false},
      // {src: `${this.CSS_SRC}/style.css`, inject: true, vendor: false},
      {src: `${this.ASSETS_SRC}/dist/app.css`, inject: true, vendor: false}
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    /* Add to or override NPM module configurations: */
    // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
  }

}
