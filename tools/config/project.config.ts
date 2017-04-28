import { join } from 'path';
import { argv } from 'yargs';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    this.APP_TITLE = 'WTHApps';
    this.BOOTSTRAP_DIR = argv['app'] || 'portal';
    this.BOOTSTRAP_MODULE = `../${this.BOOTSTRAP_DIR}/main`;

    this.ENABLE_SCSS = true;
    this.SCSS_SRC = `${this.APP_SRC}/scss`;


    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      {src: 'lodash/lodash.min.js', inject: 'libs'},
      {src: 'primeng/resources/primeng.min.css', inject: true},
      {src: 'primeng/resources/themes/bootstrap/theme.css', inject: true},
      {src: 'actioncable/lib/assets/compiled/action_cable.js', inject: 'libs'},
      {src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs'},
      {src: 'dropzone/dist/dropzone.js', inject: 'libs'},
      {src: 'cropper/dist/cropper.min.js', inject: 'libs'},
      {src: 'wheelevent.js/wheelevent.js', inject: 'libs'},
      {src: 'wheelzoom.js/wheelzoom.min.js', inject: 'libs'},
      {src: 'shave/dist/shave.min.js', inject: 'libs'},
      {src: 'slick-carousel/slick/slick.min.js', inject: 'libs'},
      {src: 'aws-sdk/dist/aws-sdk.min.js', inject: 'libs'}
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      {src: `${this.APP_SRC}/core/js/common.js`, inject: true, vendor: false}
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];


    let additionalPackages: ExtendPackages[] = [
      {
        name: 'ng2-cookies',
        path: 'node_modules/ng2-cookies/ng2-cookies.js'
      },
      {
        name: 'primeng',
        path: 'node_modules/primeng/primeng.js'
      },
      {
        name: 'angular2-recaptcha',
        path: 'node_modules/angular2-recaptcha/index.js'
      },
      {
        name: 'ng2-bs3-modal',
        path: 'node_modules/ng2-bs3-modal/ng2-bs3-modal.js'
      },
      {
        name: 'ngx-infinite-scroll',
        path: 'node_modules/ngx-infinite-scroll/bundles/ngx-infinite-scroll.umd.js'
      },
      {
        name: 'angular2-cookie',
        path: 'node_modules/angular2-cookie/core.js'
      },
      {
        name: 'ng2-material-dropdown',
        path: 'node_modules/ng2-material-dropdown/dist/ng2-dropdown.bundle.js'
      },
      {
        name: 'ng2-tag-input',
        path: 'node_modules/ng2-tag-input/dist/ng2-tag-input.bundle.js'
      },
      {
        name: 'rxjs',
        path: 'node_modules/rxjs/Rx.js'
      },
      {
        name: 'aws-sdk',
        path: 'node_modules/aws-sdk/dist/aws-sdk.js'
      },
      {
        name: 'angular2-uuid',
        path: 'node_modules/angular2-uuid/index.js'
      }
    ];

    this.addPackagesBundles(additionalPackages);

    // Add packages (e.g. ng2-translate)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'ng2-translate',
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    //
    // this.addPackagesBundles(additionalPackages);

    /* Add proxy middlewar */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')({ ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
