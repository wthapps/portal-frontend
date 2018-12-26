import { Component, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ConversationApiCommands } from '@shared/commands/chat/coversation-commands';
import { Constants } from '@shared/constant';
import { ApiBaseService, AuthService, NotificationService, WTHNavigateService } from '@shared/services';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';
import { User } from '@wth/shared/shared/models';
import { ChannelService } from '../../channels/channel.service';

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

  readonly tooltip: any = Constants.tooltip;
  readonly defaultAvatar: string = Constants.img.avatar;
  showUpdatedVersion = false;
  showSearchMobile = false;
  newVersion: string;
  constants: any;
  readonly urls: any = Constants.baseUrls;
  type = 'update'; // update , connection
  notificationCount = 0;

  @HostListener('document:click', ['$event'])
  clickedOutside($event: any) {
    // here you can hide your menu
    this.showSearchMobile = false;
  }

  constructor(
    private navigateService: WTHNavigateService,
    private channelService: ChannelService,
    private renderer: Renderer2,
    private swUpdate: SwUpdate,
    private authService: AuthService,
    private apiBaseService: ApiBaseService,
    public connectionService: ConnectionNotificationService,
    public notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    if (!this.swUpdate.isEnabled) {
      this.subscribeChanneService();
    } else {
      this.swUpdate.checkForUpdate()
        .then((res) => {
          this.subscribeChanneService();
        });
    }

    if (this.authService.isAuthenticated()) {
      this.countCommonNotification().then(() => this.countChatNotification());
    }

  }

  ngOnDestroy(): void {
    this.channelService.unsubscribe();
  }

  countCommonNotification(): Promise<any> {
    return this.notificationService.getNewNotificationCounts().toPromise()
      .then(res => {
        this.connectionService.newNotifCount = res.data.connection_count;
        this.notificationService.newNotifCount = res.data.update_count;
      });
  }

  countChatNotification(): void {
    this.apiBaseService
      .addCommand(ConversationApiCommands.notificationsCount())
      .subscribe((res: any) => {
        this.notificationCount = res.data.count;
      });
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
