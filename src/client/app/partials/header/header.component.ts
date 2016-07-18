import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {
  UserService,
} from '../../shared/index';


/**
 * This class represents the header component.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-header',
  templateUrl: 'header.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})
export class HeaderComponent {
  first_name:string = '';
  last_name:string = '';

  constructor(private _userService:UserService,
              private _router:Router) {
    if (this._userService.loggedIn) {
      this.first_name = this._userService.profile.first_name;
      this.last_name = this._userService.profile.last_name;
    }
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

  isLoggedIn() {
    // Check if there's an unexpired JWT
    return this._userService.loggedIn;
  }
}
