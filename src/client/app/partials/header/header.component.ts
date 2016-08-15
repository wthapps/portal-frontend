import {Component} from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router,
  NavigationEnd
} from '@angular/router';

import {
  UserService
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
  urls: any;

  navTitle: string;
  nav_title_url: string = '';

  constructor(private userService: UserService,
              private router: Router) {
    if (this.userService.loggedIn) {
      this.first_name = this.userService.profile.first_name;
      this.last_name = this.userService.profile.last_name;
    }

    this.urls = new Array();
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.urls.length = 0; //Fastest way to clear out array
      this.getNavTitle(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  getNavTitle(url: string): void {
    this.urls.unshift(url); //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
    if (url.lastIndexOf('/') > 0) {
      this.getNavTitle(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
    }
    if (this.urls[0] == '/account') {
      this.navTitle = 'Library';
      
    } else {
      this.navTitle = null;
    }
  }

  onNavigateByTitle(event: any): void {
    event.preventDefault();
    if(this.navTitle == 'Library'){
      this.router.navigate(['/account/apps']);
    }
  }

  logout() {

    this.userService.logout('users/sign_out')
      .subscribe(
        response => {
          this.userService.deleteUserInfo();
          this.router.navigate(['/login']);
        },
        error => {
          this.userService.deleteUserInfo();
          this.router.navigate(['/login']);
          console.log('logout error', error);
        }
      );
  }

  isLoggedIn() {
    // Check if there's an unexpired JWT
    return this.userService.loggedIn;
  }
}
