import { join } from 'path';

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
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    this.ENABLE_SCSS = true;
    this.SCSS_SRC = `${this.APP_SRC}/scss`;

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,

      {src: 'actioncable/lib/assets/compiled/action_cable.js', inject: 'libs'},
      {src: 'dropzone/dist/dropzone.js', inject: 'libs'},
      {src: 'slick-carousel/slick/slick.min.js', inject: 'libs'},
      {src: 'linkifyjs/dist/linkify.js', inject: 'libs'},
      {src: 'linkifyjs/dist/linkify-html.min.js', inject: 'libs'},
      {src: 'file-saver/FileSaver.min.js', inject: 'libs'},
      {src: 'moment/moment.js', inject: 'libs'},
      {src: 'cropper/dist/cropper.min.js', inject: 'libs'},
      {src: 'cropperjs/dist/cropper.min.js', inject: 'libs'},
      {src: 'tether/dist/js/tether.min.js', inject: 'libs'},
      {src: 'tether-shepherd/dist/js/shepherd.min.js', inject: 'libs'},

      /* Select a pre-built Material theme */
      {src: '@angular/material/prebuilt-themes/indigo-pink.css', inject: true},

      //editor
      {src: 'quill/dist/quill.min.js', inject: 'libs'}
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},

    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      {src: `${this.APP_SRC}/core/js/common.js`, inject: true, vendor: false}
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    let additionalPackages: ExtendPackages[] = [
      {
        name: 'ngx-cookie',
        path: 'node_modules/ngx-cookie/bundles/ngx-cookie.umd.js'
      },
      {
        name: 'primeng',
        path: 'node_modules/primeng',
        packageMeta: {
          defaultJSExtension: 'js'
        }
      },
      {
        name: 'angular2-recaptcha',
        path: 'node_modules/angular2-recaptcha',
        packageMeta: {
          main:'index',
          defaultJSExtension: 'js'
        }
      },
      {
        name: 'ng2-bs3-modal',
        path: 'node_modules/ng2-bs3-modal',
        packageMeta: {
          defaultJSExtension: true
        }
      },
      {
        name: 'ngx-infinite-scroll',
        path: 'node_modules/ngx-infinite-scroll/bundles/ngx-infinite-scroll.umd.js'
      },
      {
        name: 'ngx-chips',
        path: 'node_modules/ngx-chips/dist/ngx-chips.bundle.js',
        packageMeta: {
          format: 'cjs'
        }
      },
      {
        name: 'ng2-material-dropdown',
        path: 'node_modules/ng2-material-dropdown/dist/ng2-dropdown.bundle.js',
        packageMeta: {
          format: 'cjs'
        }
      },
      {
        name: '@ngrx/core',
        path: 'node_modules/@ngrx/core/bundles/core.min.umd.js',
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/store',
        path: 'node_modules/@ngrx/store/bundles/store.umd.js',
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: '@ngrx/effects',
        path: 'node_modules/@ngrx/effects/bundles/effects.umd.js',
        packageMeta: {
          defaultExtension: 'js'
        }
      },
      {
        name: '@angular/cdk',
        path: 'node_modules/@angular/cdk/bundles/cdk.umd.js'
      },
      {
        name: '@angular/cdk/a11y',
        path: 'node_modules/@angular/cdk/bundles/cdk-a11y.umd.js'
      },
      {
        name: '@angular/cdk/bidi',
        path: 'node_modules/@angular/cdk/bundles/cdk-bidi.umd.js'
      },
      {
        name: '@angular/cdk/coercion',
        path: 'node_modules/@angular/cdk/bundles/cdk-coercion.umd.js'
      },
      {
        name: '@angular/cdk/collections',
        path: 'node_modules/@angular/cdk/bundles/cdk-collections.umd.js'
      },
      {
        name: '@angular/cdk/keycodes',
        path: 'node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js'
      },
      {
        name: '@angular/cdk/observers',
        path: 'node_modules/@angular/cdk/bundles/cdk-observers.umd.js'
      },
      {
        name: '@angular/cdk/overlay',
        path: 'node_modules/@angular/cdk/bundles/cdk-overlay.umd.js'
      },
      {
        name: '@angular/cdk/platform',
        path: 'node_modules/@angular/cdk/bundles/cdk-platform.umd.js'
      },
      {
        name: '@angular/cdk/portal',
        path: 'node_modules/@angular/cdk/bundles/cdk-portal.umd.js'
      },
      {
        name: '@angular/cdk/rxjs',
        path: 'node_modules/@angular/cdk/bundles/cdk-rxjs.umd.js'
      },
      {
        name: '@angular/cdk/scrolling',
        path: 'node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js'
      },
      {
        name: '@angular/cdk/stepper',
        path: 'node_modules/@angular/cdk/bundles/cdk-stepper.umd.js'
      },
      {
        name: '@angular/cdk/table',
        path: 'node_modules/@angular/cdk/bundles/cdk-table.umd.js'
      }
    ];

    this.SYSTEM_BUILDER_CONFIG.packageConfigPaths = [
      `${this.NPM_BASE}@angular/*/package.json`,
      `${this.NPM_BASE}@ngrx/*/package.json`,
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

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
