import { Component, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../constant/config/constants';
import { WTHNavigateService } from '../../services/wth-navigate.service';
import { ChannelService } from '../../channels/channel.service';
import { NotificationService } from '../../services/notification.service';
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
  selector: 'w-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() loggedIn: boolean;
  @Input() hasSearch: Boolean = true;
  @Input() auth: any;
  @Input() showSideBar: Boolean = true;

  @ViewChild('notifications')
  notificationListComponent: NotificationListComponent;

  tooltip: any = Constants.tooltip;
  defaultAvatar: string = Constants.img.avatar;
  showUpdatedVersion: boolean = false;
  showSearchMobile: boolean = false;
  newVersion: string;
  constants: any;
  urls: any = Constants.baseUrls;
  type: string = 'update'; // update , connection

  @HostListener('document:click', ['$event'])
  clickedOutside($event: any) {
    // here you can hide your menu
    this.showSearchMobile = false;
  }

  constructor(
    private navigateService: WTHNavigateService,
    private channelService: ChannelService,
    private renderer: Renderer2,
    public connectionService: ConnectionNotificationService,
    public notificationService: NotificationService,
    public authService: AuthService
  ) {
    // console.log('authservice:::', this.authService.jwt, this.authService.user);
    // if (this.authService.jwt) {
    //   this.authService.validateToken();
    // }
  }

  ngOnInit(): void {
    this.channelService.subscribe();
  }

  ngOnDestroy(): void {
    this.channelService.unsubscribe();
  }

  onShowSideBar(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('show sidebar');
    this.renderer.addClass(document.body, 'left-sidebar-open');
  }

  onShowSearchMobile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showSearchMobile = true;
  }
}
