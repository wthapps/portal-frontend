import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Constants } from "@shared/constant";
import { User } from "@shared/shared/models";
import { AuthService } from '@wth/shared/services';
import { WTHNavigateService } from "@shared/services/wth-navigate.service";
import { ChannelService } from "@shared/channels/channel.service";
import { Router } from "@angular/router";
import { ConnectionNotificationService } from "@shared/services/connection-notification.service";
import { NotificationService } from "@shared/services/notification.service";
import { NotificationListComponent } from "@shared/shared/components/notification-list/notification-list.component";

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
  showUpdatedVersion: boolean = false;
  showSearchMobile: boolean = false;
  newVersion: string;
  constants: any;
  urls: any = Constants.baseUrls;
  type: string = 'update'; // update , connection

  constructor(private navigateService: WTHNavigateService,
              private channelService: ChannelService,
              private router: Router,
              public connectionService: ConnectionNotificationService,
              public notificationService: NotificationService,
              public authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.notificationService.getNewNotificationCounts().toPromise()
        .then(res => {
          this.connectionService.newNotifCount = res.data.connection_count;
          this.notificationService.newNotifCount = res.data.update_count;
        });
    }
  }

  ngAfterViewInit(): void {
    let documentElem = $(document);
    let nav = $('.navbar-default');
    let lastScrollTop = 0;

    documentElem.on('scroll', function () {
      let currentScrollTop = $(this).scrollTop();
      if (currentScrollTop < lastScrollTop && currentScrollTop != 0) {
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
    $('.navbar-nav-notification').removeClass('open');

    // Navigate to notification page of social module
    if (this.navigateService.inSameModule([Constants.baseUrls.note, Constants.baseUrls.social, Constants.baseUrls.media, Constants.baseUrls.contact]))
      this.navigateService.navigateTo(['/notifications'], {type: this.type});
    else
      this.navigateService.navigateOrRedirect('notifications', 'social');
  }

  getMoreNotifications() {
    if (this.type == 'connection')
      this.connectionService.getMoreNotifications();
    else
      this.notificationService.getMoreNotifications();
  }

  doAction(action: any, notif_id: string) {
    if (this.type === 'connection')
      this.connectionService.doAction(action, notif_id);
    else
      this.notificationService.doAction(action, notif_id);
  }

  getLatestNotifications() {
    if (this.type === 'connection')
      this.connectionService.getLatestNotifications();
    else
      this.notificationService.getLatestNotifications();
  }

  toggleViewNotifications() {
    this.getLatestNotifications(); // Load latest notifications in the first click
    if (this.notificationService.notifications.length <= 0) {
      this.getMoreNotifications();
    }
    this.markAsSeen();
  }

  markAsSeen() {
    if (this.type === 'connection')
      this.connectionService.markAsSeen();
    else
      this.notificationService.markAsSeen();
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
