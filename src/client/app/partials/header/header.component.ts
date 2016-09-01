import {Component, AfterViewInit} from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router,
  NavigationEnd
} from '@angular/router';

import {
  UserService,
  Constants
} from '../../shared/index';

declare var $: any;

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
export class HeaderComponent implements AfterViewInit {
  first_name: string = '';
  last_name: string = '';
  urls: any;

  headerOver: boolean = true;

  navTitle: string;
  nav_title_url: string = '';

  showSearchBar: boolean = false;

  constructor(private userService: UserService,
              private router: Router) {

    console.log(this.userService);

    if (this.userService.loggedIn) {
      this.first_name = this.userService.profile.first_name;
      this.last_name = this.userService.profile.last_name;

      if (!this.userService.profile.profile_image) {
        this.userService.profile.profile_image = Constants.img.avatar;
      }

    }

    this.urls = new Array();
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.urls.length = 0; //Fastest way to clear out array
      this.getNavTitle(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  ngAfterViewInit(): void {
    let documentElem = $(document);
    let nav = $('.header');
    let lastScrollTop = 0;

    documentElem.on('scroll', function () {
      var currentScrollTop = $(this).scrollTop();
      if (currentScrollTop < lastScrollTop && currentScrollTop != 0) nav.addClass('active');
      else nav.removeClass('active');
      lastScrollTop = currentScrollTop;
    });
  }

  getNavTitle(url: string): void {
    this.urls.unshift(url); //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
    if (url.lastIndexOf('/') > 0) {
      this.getNavTitle(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
    }

    //console.log((this.urls[1])); //["/account", "/account/my-apps"]

    // header overlay
    if (this.urls[0] == '/account') {
      if (this.urls[1] && this.urls[1] == '/account/recovery') {
        this.headerOver = true;
      } else {
        this.headerOver = false;
      }
    } else {
      this.headerOver = true;
    }
    // end header overlay


    // show navTitle
    let param_url = [''];
    if (this.urls[1]) {
      param_url = (this.urls[1]).split('?');
    }
    if (param_url[0] == '/account/setting') {
      this.showSearchBar = false;
      this.navTitle = 'Account Management';
    } else if (param_url[0] == '/account/apps') {
      this.showSearchBar = true;
      this.navTitle = 'Apps';
    } else if (param_url[0] == '/account/my-apps') {
      this.showSearchBar = true;
      this.navTitle = 'My Apps';
    } else {
      this.showSearchBar = false;
      this.navTitle = null;
    }
  }

  onNavigateByTitle(event: any): void {
    event.preventDefault();
    if (this.navTitle == 'Library') {
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
