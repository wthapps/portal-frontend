import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                           from '@angular/router';
import {HTTP_PROVIDERS}     from '@angular/http';

import {
  Config,
  APP_SHARED_PROVIDERS,
  UserService,
  LoadingComponent,
  DialogComponent,
  SimpleToastsComponent
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
    SimpleToastsComponent
  ]
})
export class AppComponent {
  constructor(private _userService:UserService, private _router:Router) {
    console.log('Environment config', Config);
  }

  logout() {

    this._userService.logout('users/sign_out')
      .subscribe(
        response => {
          this._userService.deleteUserInfo();
          this._router.navigateByUrl('/login');
        },
        error => {
          this._userService.deleteUserInfo();
          this._router.navigateByUrl('/login');
          console.log('logout error', error);
        }
      );
  }

  public isLoggedIn() {
    // Check if there's an unexpired JWT
    return this._userService.loggedIn;
  }
}
