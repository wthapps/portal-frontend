import { Component, AfterViewInit, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd
} from '@angular/router';

import {
  UserService,
  Constants
} from '../../shared/index';


import { Ng2Cable, Broadcaster } from 'ng2-cable/js/index';

declare var $: any;
declare let ActionCable: any;
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

  showSearchBar: boolean = false;
  App:any = {};

  constructor(private userService: UserService,
              private router: Router,
              private cable: Ng2Cable,
              private broadcaster: Broadcaster
  ) {

    //console.log(this.userService);
    this.urls = new Array();
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.urls.length = 0; //Fastest way to clear out array
      this.getNavTitle(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  ngOnInit() {
    //
    // this.cable.subscribe('http://localhost:4000/cable', 'Notification');
    //
    // this.broadcaster.on<string>('Notification').subscribe(
    //   message => {
    //     console.log('cable message: ', message);
    //   }
    // );


    if (this.userService.loggedIn) {
      this.first_name = this.userService.profile.first_name;
      this.last_name = this.userService.profile.last_name;

      if (!this.userService.profile.profile_image) {
        this.userService.profile.profile_image = Constants.img.avatar;
      }
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
        this.imgLogo = Constants.img.logoWhite;
      } else {
        this.headerOver = false;
        this.imgLogo = Constants.img.logo;
      }

      // zone layout
    } else if (this.urls[0] == '/zone') {
      this.headerOver = false;
      this.imgLogo = Constants.img.logoZone;
      // zone layout
    } else {
      this.headerOver = true;
      this.imgLogo = Constants.img.logoWhite;
    }
    // end header overlay


    // show navTitle
    let param_url = this.urls;
    if (this.urls[1]) {
      param_url = (this.urls[1]).split('?');
    }

    //console.log(param_url);

    if (param_url[0] == '/account/setting') {
      this.showSearchBar = false;
    } else if (param_url[0] == '/account/apps') {
      this.showSearchBar = true;
    } else if (param_url[0] == '/account/my-apps') {
      this.showSearchBar = true;
      // zone layout
    } else if (param_url[0] == '/zone' || param_url[0] == '/zone/picture') {
      this.showSearchBar = true;
      this.navigationUrl = '/zone/picture/photo';
      // zone layout

    } else {
      this.showSearchBar = false;
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
    ActionCable.startDebugging();
    var app: any = {cable: null, notification: null};
    app.cable = ActionCable.createConsumer("ws://localhost:4000/cable");
    app.notification = app.cable.subscriptions.create('NotificationChannel', {
      //   // ActionCable callbacks
        connected: function() {
          console.log('received: ******************************************************************************', data);
          // writeLog("connected", this.identifier);
        },
      //   disconnected: function() {
      //     writeLog("disconnected", this.identifier);
      //   },
      //   rejected: function() {
      //     writeLog("rejected");
      //   },
        received: function(data: any) {
          console.log('received: ******************************************************************************', data);
          // writeLog('received: ******************************************************************************', data);
          // this.tick(data);
        }
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
     });
  }
}
