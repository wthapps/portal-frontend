import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import {
  Router,
  NavigationEnd
} from '@angular/router';

import {
  UserService,
  Constants
} from '../../shared/index';


import { SearchFormComponent } from './sub/search-form.component';
import { NotificationService } from './notification/notification.service';
import { ChannelNotificationService } from '../../shared/channels/index';

declare var $: any;
declare var _: any;

declare let App: any;

/**
 * This class represents the header component.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements AfterViewInit, OnInit {
  first_name: string = '';
  last_name: string = '';
  urls: any;

  navigationUrl: string = '/';

  headerOver: boolean = true;
  imgLogo: string = Constants.img.logoWhite;

  showSearchBar: boolean = true;

  notifications: Array<any> = new Array<any>();

  @ViewChild('search') searchForm: SearchFormComponent;

  constructor(private userService: UserService,
              private router: Router,
              private notificationService: NotificationService,
              private notificationChannel: ChannelNotificationService) {
    this.urls = new Array();
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.urls.length = 0; //Fastest way to clear out array
      this.getNavTitle(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });



  }

  ngOnInit() {

    if (this.userService.loggedIn) {
      this.first_name = this.userService.profile.first_name;
      this.last_name = this.userService.profile.last_name;

      if (!this.userService.profile.profile_image) {
        this.userService.profile.profile_image = Constants.img.avatar;
      }
    }

    if(this.userService.loggedIn) {
      this.notificationService.get().subscribe(
        (result: any) => {
          this.notifications = result.data;
        },
        (error: any) => {
          console.log('error', error);
        });

      this.notificationChannel.notificationUpdated.subscribe(
        (response: any) => {
          this.notifications.unshift(response);
          console.log('response', response);
        });
    }
  }

  ngAfterViewInit(): void {
    let documentElem = $(document);
    let nav = $('.header');
    let lastScrollTop = 0;

    documentElem.on('scroll', function () {
      var currentScrollTop = $(this).scrollTop();
      if (currentScrollTop < lastScrollTop && currentScrollTop != 0) {
        nav.addClass('active');
      } else {
        nav.removeClass('active');
      }
      lastScrollTop = currentScrollTop;
    });

    documentElem.on('click', '.navbar-nav-notification .dropdown-menu', function (e: any) {
      e.stopPropagation();
      $(this).find('.dropdown-menu').hide();
    });
    documentElem.on('click', '.navbar-nav-notification .dropdown-submenu .dropdown-toggle', function (e: any) {
      e.stopPropagation();
      e.preventDefault();
      $(this).next('ul').toggle();
    });
    documentElem.on('click', function (e: any) {
      if (!$('.navbar-nav-notification').hasClass('open')) {
        $('.navbar-nav-notification .dropdown-submenu').find('.dropdown-menu').hide();
      }
    });
  }

  getNavTitle(url: string): void {
    this.urls.unshift(url); //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
    if (url.lastIndexOf('/') > 0) {
      this.getNavTitle(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
    }

    //console.log((this.urls[1])); //["/account", "/account/my-apps"]

    // header overlay
    // console.log(this.urls);
    if (this.urls[0] == '/account') {
      if (this.urls[1] && this.urls[1] == '/account/recovery') {
        this.headerOver = true;
        this.imgLogo = Constants.img.logoWhite;
      } else {
        this.headerOver = false;
        this.imgLogo = Constants.img.logo;
      }
      this.searchForm.show = false;
      // zone layout
    } else if (this.urls[0] == '/zone') {
      this.headerOver = false;
      this.imgLogo = Constants.img.logoZone;

      this.showSearchBar = true;
      if (this.urls[1] && this.urls[1] == '/zone/social') {
        this.searchForm.init('social');
      }
      // zone layout
    } else {
      this.searchForm.show = false;
      this.headerOver = true;
      this.imgLogo = Constants.img.logoWhite;

      this.showSearchBar = false;
    }
    // end header overlay


    // show navTitle
    let param_url = this.urls;
    if (this.urls[1]) {
      param_url = (this.urls[1]).split('?');
    }
  }

  onNavigation(event: any): void {
    event.preventDefault();
    this.router.navigate([this.navigationUrl]);
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

  sendMessage(event: any) {

    App.notification.sendMessage(3, 'hello world');

    // this.api.get('zone/social_network/notification/broadcast_message')
    //     .subscribe(result => {
    //         console.log('message broadcasted', result);
    //
    //       },
    //       error => {
    //
    //       });
    // console.log('cable', App, App.notifications);


    //   // ActionCable callbacks
    // connected: function() {
    //   return this.perform('subscribed', {});
    //   console.log('connected..................');
    // },
    // disconnected: function() {
    //   console.log("disconnected", this.identifier);
    // },
    // rejected: function() {
    //   console.log("rejected");
    // },
    // ,
    //   // Custom methods
    //   start: function() {
    //     writeLog("starting clock");
    //     this.perform("start");
    //   },
    //   stop: function() {
    //     writeLog("stopping clock");
    //     this.perform("stop");
    //   },
    //   tick: function(data: any) {
    //     writeLog("tick received", data);
    //     this.tock("ack");
    //   },
    //   tock: function(message: any) {
    //     writeLog("tock sent", message);
    //     return this.perform("tock", { message: message });
    //   }
    // });
    //
    // function writeLog(message: any, data: any = null) {
    //   console.log(message, data);
    // }
    //
    // function deserialize(data) {
    //   return JSON.stringify(data);
    // }
    //
    // function guid() {
    //   function s4() {
    //     return Math.floor((1 + Math.random()) * 0x10000)
    //                .toString(16)
    //                .substring(1);
    //   }
    //   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    //     s4() + '-' + s4() + s4() + s4();
    // }
  }
}
