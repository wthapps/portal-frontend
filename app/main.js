/*import { bootstrap }    from '@angular/platform-browser-dynamic';

// Our main component
import { AppComponent } from './app.component';

bootstrap(AppComponent);*/
System.register(['@angular/platform-browser-dynamic', '@angular/core', '@angular/common', '@angular/router', './app.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, core_1, common_1, router_1, app_component_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            }],
        execute: function() {
            platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
                router_1.ROUTER_PROVIDERS,
                core_1.provide(common_1.APP_BASE_HREF, { useValue: '/' }) // this line
            ]);
        }
    }
});
//# sourceMappingURL=main.js.map