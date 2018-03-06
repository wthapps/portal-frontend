import {
  Component, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild,
  Input
} from '@angular/core';
import { Constants } from '../../../constant/config/constants';
import { WTHNavigateService } from '../../../services/wth-navigate.service';
import { ChannelService } from '../../../channels/channel.service';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';
import { NotificationListComponent } from '@shared/shared/components/notification-list/notification-list.component';
import { AuthService } from '@wth/shared/services';
import { User } from '@wth/shared/shared/models';

declare var $: any;
declare var _: any;

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

  @HostListener('document:click', ['$event']) clickedOutside($event: any) {
    // here you can hide your menu
    this.showSearchMobile = false;
  }

  constructor(private navigateService: WTHNavigateService,
              private channelService: ChannelService,
              private router: Router,
              public connectionService: ConnectionNotificationService,
              public notificationService: NotificationService,
              public authService: AuthService) {
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

  onShowSearchMobile($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.showSearchMobile = true;
  }

  logout() {
    this.authService.logout();
    // this.userService.logout('users/sign_out')
    //   .take(1)
    //   .subscribe(
    //     () => {
    //       window.location.href = `${Constants.baseUrls.app}/login`;
    //       // this.userService.deleteUserInfo();
    //       // this.appearancesChannelService.unsubscribe();
    //       // this.router.navigate(['/login']);
    //     },
    //     error => {
    //       this.userService.deleteUserInfo();
    //       // this.router.navigate(['/login']);
    //       // console.log('logout error', error);
    //     }
    //   );
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
    if (this.type == 'connection')
      this.connectionService.doAction(action, notif_id);
    else
      this.notificationService.doAction(action, notif_id);
  }

  getLatestNotifications() {
    if (this.type == 'connection')
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
    if (this.type == 'connection')
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
