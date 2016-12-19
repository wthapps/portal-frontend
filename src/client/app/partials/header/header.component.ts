import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import {
  Router,
  NavigationEnd
} from '@angular/router';

import {
  UserService,
  ApiBaseService,
  Constants
} from '../../shared/index';


import { Ng2Cable, Broadcaster } from 'ng2-cable/js/index';
import { SearchFormComponent } from './sub/search-form.component';

import { AppBaseTestOther } from '../../shared/function-base/app.call';

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

  showSearchBar: boolean = true;
  App: any = {};

  @ViewChild('search') searchForm: SearchFormComponent;

  constructor(private userService: UserService,
              private router: Router,
              private cable: Ng2Cable,
              private broadcaster: Broadcaster,
              private api: ApiBaseService
  ) {

    console.log('AppBaseTestOther:', AppBaseTestOther('function test'));
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
    // console.log(this.urls);
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

      this.showSearchBar = true;
      if (this.urls[1] && this.urls[1] == '/zone/social') {
        this.searchForm.init('social')
      }
      // zone layout
    } else {
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



    ActionCable.startDebugging();
    var App: any = {};
    App.cable = ActionCable.createConsumer("ws://localhost:4444/cable");
    App.notifications = App.cable.subscriptions.create('ChatroomsChannel', {
      received: function(response: any) {
        console.log('response', response);
      }
    });

    App.notifications.perform('send_message',{chatroom_id: 3, message: 'hello world'});

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
