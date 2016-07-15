import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                           from '@angular/router';
import {HTTP_PROVIDERS}     from '@angular/http';

import {
  Config,
  APP_SHARED_PROVIDERS,
  LoadingComponent,
  DialogComponent,
  SimpleToastsComponent,
  HeaderComponent,
  FooterComponent
}                           from './shared/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'wth-app',
  viewProviders: [
    HTTP_PROVIDERS,
    APP_SHARED_PROVIDERS
  ],
  templateUrl: 'app.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    LoadingComponent,
    DialogComponent,
    SimpleToastsComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class AppComponent {
  constructor() {
    console.log('Environment config', Config);
  }
}
