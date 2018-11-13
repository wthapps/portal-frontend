import { UserService } from './../../services/user.service';
import { Component, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../constant/config/constants';
import { WTHNavigateService } from '../../services/wth-navigate.service';
import { ChannelService } from '../../channels/channel.service';
import { NotificationService } from '../../services/notification.service';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';
import { User } from '@wth/shared/shared/models';
import { Observable } from 'rxjs/Observable';

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
  @Input() serviceWorkerEnabled = false;

  readonly tooltip: any = Constants.tooltip;
  readonly defaultAvatar: string = Constants.img.avatar;
  showUpdatedVersion = false;
  showSearchMobile = false;
  newVersion: string;
  constants: any;
  readonly urls: any = Constants.baseUrls;
  type = 'update'; // update , connection

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
    public notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    if (!this.serviceWorkerEnabled) {
    this.subscribeChanneService();
    }
  }

  ngOnDestroy(): void {
    this.channelService.unsubscribe();
  }

  subscribeChanneService() {
    console.log('subscribe channel service');
    this.channelService.subscribe();
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
