import { Component, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Constants } from '../../../constant/config/constants';
import { WTHNavigateService } from '../../../services/wth-navigate.service';
import { ChannelService } from '../../../channels/channel.service';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';

declare var $: any;
declare var _: any;
declare let App: any; //This App stands for ActionCable

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'wth-header-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderNavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  tooltip: any = Constants.tooltip;
  defaultAvatar: string = Constants.img.avatar;

  constructor(public userService: UserService,
              private navigateService: WTHNavigateService,
              private channelService: ChannelService,
              public notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.channelService.subscribe();
  }

  ngOnDestroy(): void {
    this.channelService.unsubscribe();
  }

  ngAfterViewInit(): void {
    let documentElem = $(document);
    let nav = $('.navbar-default');
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

  logout() {
    this.userService.logout('users/sign_out')
      .take(1)
      .subscribe(
        () => {
          window.location.href = `${Constants.baseUrls.app}/login`;
          // this.userService.deleteUserInfo();
          // this.appearancesChannelService.unsubscribe();
          // this.router.navigate(['/login']);
        },
        error => {
          this.userService.deleteUserInfo();
          // this.router.navigate(['/login']);
          // console.log('logout error', error);
        }
      );
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
      case 'contacts':
        url = `${Constants.baseUrls.contact}`;
        break;
      case 'notes':
        url = `${Constants.baseUrls.note}`;
        break;
    }

    window.location.href = url + '/' + path;
  }


  viewAllNotifications() {
    // Close mini notification dropdown box in the header
    $('.navbar-nav-notification').removeClass('open');

    // Navigate to notification page of social module
    this.navigateService.navigateOrRedirect('notifications', 'social');
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  doAction(action: any, notif_id: string) {
    this.notificationService.doAction(action, notif_id);
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

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }
}
