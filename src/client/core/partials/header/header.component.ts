import { Component, AfterViewInit, OnInit, ViewChild, HostBinding, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { Constants } from '../../shared/config/constants';

import { SearchFormComponent } from './search/search-form.component';
import { NotificationService } from '../../shared/services/notification.service';
import { AppearancesChannelService } from '../../shared/channels/appearances-channel.service';

declare var $: any;
declare var _: any;
declare let App: any; //This App stands for ActionCable

/**
 * This class represents the header component.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input('headerOver') headerOver: boolean = false;
  @HostBinding('class') headerClass = 'header';

  firstName: string = '';
  lastName: string = '';
  urls: any;

  navigationUrl: string = '/';

  imgLogo: string = Constants.img.logo;
  flagsRelease: boolean = Constants.flagsRelease;

  showSearchBar: boolean = true;

  communitiesUrl: string = '';

  // notifications: Array<any> = new Array<any>();
  // newNotifCount: number = 0 ;
  currentNotifId: any;
  notifOffset: number = 0;

  @ViewChild('search') searchForm: SearchFormComponent;

  constructor(public userService: UserService,
              private router: Router,
              public notificationService: NotificationService,
              private appearancesChannelService: AppearancesChannelService) {
  }

  ngOnInit() {

    if (this.headerOver) {
      this.headerClass = 'header header-over';
      this.imgLogo = Constants.img.logoWhite;
    }

    if (this.userService.loggedIn) {
      this.firstName = this.userService.profile.first_name;
      this.lastName = this.userService.profile.last_name;

      if (!this.userService.profile.profile_image) {
        this.userService.profile.profile_image = Constants.img.avatar;
      }

      // Start the appearance channel after notification channel is connected
      console.debug('start channel notification');
      this.notificationService.startChannel(this.appearancesChannelService.subscribe());
    }
  }

  ngOnDestroy() {
  //  TODO: Unsubscribe all cable services when destroyed
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

  onNavigation(event: any): void {
    event.preventDefault();
    console.log('location', window.location);
    if (window.location.origin != Constants.baseUrls.app) {
      window.location.href = Constants.baseUrls.app;
    }
  }

  logout() {

    this.userService.logout('users/sign_out')
      .take(1)
      .subscribe(
        response => {
          window.location.href = `${Constants.baseUrls.app}/login`;
          // this.userService.deleteUserInfo();
          // this.appearancesChannelService.unsubscribe();
          // this.router.navigate(['/login']);
        },
        error => {
          // this.userService.deleteUserInfo();
          // this.router.navigate(['/login']);
          // console.log('logout error', error);
        }
      );
  }

  isLoggedIn() {
    // Check if there's an unexpired JWT
    return this.userService.loggedIn;
  }

  hideNotification(notification: any) {
    this.notificationService.hideNotification(notification);
  }

  turnOffNotification(notification: any) {
    console.log('turnOffNotification');
  }

  countNewNotifications() {
    this.notificationService.countNewNotifications();
  }


  // getLatestNotifications() {
  //   this.notificationService.getLatestNotifications();
  // }

  getNewNotificationsCount() {
    this.notificationService.getNewNotificationsCount();
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  doAction(action: any, notif_id: string) {
    this.notificationService.doAction(action, notif_id);
  }

  sendMessage(event: any) {

    App.notification.sendMessage(3, 'hello world');
  }

  toggleViewNotifications() {
    if (this.notificationService.notifications.length <= 0) {
      this.getMoreNotifications();
    }
    this.markAsSeen();
  }

  markAsSeen() {
    this.notificationService.markAsSeen();
  }

  toggleReadStatus(notification: any) {
    this.notificationService.toggleReadStatus(notification);
  }

  toggleAllReadStatus() {
    this.notificationService.toggleAllReadStatus();
  }

  redirectTo(domain: string = '', path: string = '', event: any) {
    event.preventDefault();

    let url: string = '';
    switch (domain) {
      case 'home':
      case 'my':
        url = `${Constants.baseUrls.myAccount}`;
        break;
      case 'media':
        url = `${Constants.baseUrls.media}`;
        break;
      case 'social':
        url = `${Constants.baseUrls.social}`;
        break;
      case 'chat':
        url = `${Constants.baseUrls.chat}`;
        break;
    }

    window.location.href = url + '/' + path;
  }
}
