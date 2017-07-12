import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  HostBinding,
  Input,
  OnDestroy,
  ComponentFactoryResolver
} from '@angular/core';

import { SearchFormComponent } from './search/search-form.component';

import { Constants } from '../../config/constants';
import { UserService } from '../../services/user.service';
import { WTHNavigateService } from '../../services/wth-navigate.service';
import { ChannelService } from '../../channels/channel.service';
import { NotificationService } from '../../services/notification.service';
import { AppearancesChannelService } from '../../channels/appearances-channel.service';
import { UndoNotificationComponent } from '../notifications/undo-notification.component';

declare var $: any;
declare var _: any;
declare let App: any; //This App stands for ActionCable

/**
 * This class represents the header component.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
  entryComponents: [UndoNotificationComponent]
})
export class HeaderComponent implements AfterViewInit, OnInit, OnDestroy {
  // @ViewChild('undo_notification', {read: ViewContainerRef}) undoNotificationRef: ViewContainerRef;
  @Input('headerOver') headerOver: boolean = false;
  @HostBinding('class') headerClass = 'header';


  undoNotification: any;
  firstName: string = '';
  lastName: string = '';
  urls: any;

  navigationUrl: string = '/';

  imgLogo: string = Constants.img.logo;
  flagsRelease: boolean = Constants.flagsRelease;

  showSearchBar: boolean = true;

  communitiesUrl: string = '';


  @ViewChild('search') searchForm: SearchFormComponent;

  constructor(public userService: UserService,
              private navigateService: WTHNavigateService,
              private channelService: ChannelService,
              public notificationService: NotificationService,
              private componentFactoryResolver: ComponentFactoryResolver,
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
      // this.notificationService.startChannel();

      // TODO comment this line for release 1.0.14. It should be uncommented after the release
      // this.appearancesChannelService.subscribe()
      // this.notificationService.startChannel(this.appearancesChannelService.subscribe());


      this.channelService.subscribe();
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

    documentElem.on('click', '#nav-notification-list', function (e: any) {
      e.stopPropagation();
    });

    documentElem.on('click', '#nav-notification-list .dropdown-toggle', function (e: any) {
      e.stopPropagation();
      $(this).next('ul').toggle();
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

  viewAllNotifications() {
    // Close mini notification dropdown box in the header
    $('.navbar-nav-notification').removeClass('open');

    // Navigate to notification page of social module
    this.navigateService.navigateOrRedirect('notifications', 'social');
  }

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
    this.notificationService.getLatestNotifications(); // Load latest notifications in the first click
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

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  redirectTo(domain: string = '', path: string = '', event: any) {
    event.preventDefault();

    let url: string = '';
    switch (domain) {
      case 'home':
        url = `${Constants.baseUrls.app}`;
        break;
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
