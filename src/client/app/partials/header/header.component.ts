import {Component} from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router,
  NavigationEnd
} from '@angular/router';

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
  first_name: string = '';
  last_name: string = '';
  _urls: any;

  navTitle: string;
  nav_title_url: string = '';

  constructor(private _userService: UserService,
              private _router: Router) {
    if (this._userService.loggedIn) {
      this.first_name = this._userService.profile.first_name;
      this.last_name = this._userService.profile.last_name;
    }

    this._urls = new Array();
    this._router.events.subscribe((navigationEnd: NavigationEnd) => {
      this._urls.length = 0; //Fastest way to clear out array
      this.getNavTitle(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  getNavTitle(url: string): void {
    this._urls.unshift(url); //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
    if (url.lastIndexOf('/') > 0) {
      this.getNavTitle(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
    }
    if (this._urls[0] == '/account') {
      this.navTitle = 'Library';
      
    } else {
      this.navTitle = null;
    }
  }

  onNavigateByTitle(event: any): void {
    event.preventDefault();
    if(this.navTitle == 'Library'){
      this._router.navigate(['/account/apps']);
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
