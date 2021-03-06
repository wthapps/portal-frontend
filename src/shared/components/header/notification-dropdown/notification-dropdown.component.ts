import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Constants } from '@shared/constant';
import { User } from '@shared/shared/models';
import { AuthService } from '@wth/shared/services';
import { WTHNavigateService } from '@shared/services/wth-navigate.service';
import { ChannelService } from '@shared/channels/channel.service';
import { Router } from '@angular/router';
import { ConnectionNotificationService } from '@shared/services/connection-notification.service';
import { NotificationService } from '@shared/services/notification.service';
import { NotificationListComponent } from '@shared/shared/components/notification-list/notification-list.component';

declare var $: any;

@Component({
  selector: 'notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css']
})
export class NotificationDropDownComponent implements OnInit, AfterViewInit {
  @Input() user: User;
  @Input() loggedIn: boolean;
  @ViewChild('notifications') notificationListComponent: NotificationListComponent;

  tooltip: any = Constants.tooltip;
  defaultAvatar: string = Constants.img.avatar;
  showUpdatedVersion = false;
  showSearchMobile = false;
  newVersion: string;
  constants: any;
  urls: any = Constants.baseUrls;
  type = 'update'; // update , connection

  constructor(private navigateService: WTHNavigateService,
              public connectionService: ConnectionNotificationService,
              public notificationService: NotificationService,
              public authService: AuthService) {
  }

  ngOnInit() {
    // This function is relocated to w-header components for PWA bug fixes
    // if (this.authService.isAuthenticated()) {
    //   this.notificationService.getNewNotificationCounts().toPromise()
    //     .then(res => {
    //       this.connectionService.newNotifCount = res.data.connection_count;
    //       this.notificationService.newNotifCount = res.data.update_count;
    //     });
    // }
  }

  ngAfterViewInit(): void {
    const documentElem = $(document);
    const nav = $('.navbar-default');
    let lastScrollTop = 0;

    documentElem.on('scroll', function () {
      const currentScrollTop = $(this).scrollTop();
      if (currentScrollTop < lastScrollTop && currentScrollTop !== 0) {
        nav.addClass('active');
      } else {
        nav.removeClass('active');
      }
      lastScrollTop = currentScrollTop;
    });

    documentElem.on('click',
      '#nav-notification-list, ' +
      '#notiItemMenuEl, ' +
      '.modal-notification-list-setting', (e: any) => {
        e.stopPropagation();
      });

    documentElem.on('click', '#nav-notification-list .dropdown-toggle', function (e: any) {
      e.stopPropagation();
      $(this).next('ul').toggle();
    });
  }

  viewAllNotifications() {
    // Close mini notification dropdown box in the header
    $('.header-nav-notification').removeClass('open');

    // Navigate to notification page of social module
    if (this.navigateService.inSameModule([Constants.baseUrls.myAccount])) {
      this.navigateService.navigateTo(['/notifications'], {type: this.type});
    } else {
      this.navigateService.navigateOrRedirect('notifications', 'my');
    }
  }

  getMoreNotifications() {
    if (this.type === 'connection') {
      this.connectionService.getMoreNotifications();
    } else {
      this.notificationService.getMoreNotifications();
    }
  }

  doAction(action: any, notif_id: string) {
    if (this.type === 'connection') {
      this.connectionService.doAction(action, notif_id);
    } else {
      this.notificationService.doAction(action, notif_id);
    }
  }

  getLatestNotifications() {
    if (this.type === 'connection') {
      this.connectionService.getLatestNotifications();
    } else {
      this.notificationService.getLatestNotifications();
    }
  }

  toggleViewNotifications() {
    this.getLatestNotifications(); // Load latest notifications in the first click
    if (this.notificationService.notifications.length <= 0) {
      this.getMoreNotifications();
    }
    this.markAsSeen();

    this.hideActionsMenu();
  }

  markAsSeen() {
    if (this.type === 'connection') {
      this.connectionService.markAsSeen();
    } else {
      this.notificationService.markAsSeen();
    }
  }

  markAllAsRead() {
    if (this.type === 'connection') {
      this.connectionService.markAllAsRead();
    } else {
      this.notificationService.markAllAsRead();
    }
  }

  hideActionsMenu(e?: any) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    $('#nav-notification-list')
      .find('ul.dropdown-menu')
      .hide();
  }

  onSelectedTab(tab: string) {
    this.type = tab;
    this.getLatestNotifications();
    this.markAsSeen();
  }

  onSettingModal() {
    this.notificationListComponent.settingModal.open();
  }

}
