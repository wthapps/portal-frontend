import { Component, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ChannelService } from '../../channels/channel.service';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';
import { User } from '@wth/shared/shared/models';
import { SwUpdate } from '@angular/service-worker';
import { ConversationApiCommands } from '@shared/commands/chat/coversation-commands';
import { Constants } from '@shared/constant';
import { ApiBaseService, AuthService, NotificationService, CommonEventHandler, CommonEventService } from '@shared/services';
import { PageVisibilityService } from '@shared/services/page-visibility.service';
import { Subscription } from 'rxjs/Subscription';
import { WebsocketService } from '@shared/channels/websocket.service';

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
export class HeaderComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() loggedIn: boolean;
  @Input() hasSearch: Boolean = true;
  @Input() auth: any;
  @Input() showSideBar: Boolean = true;
  channel = 'HeaderComponent';

  readonly tooltip: any = Constants.tooltip;
  readonly defaultAvatar: string = Constants.img.avatar;
  showUpdatedVersion = false;
  showSearchMobile = false;
  newVersion: string;
  constants: any;
  readonly urls: any = Constants.baseUrls;
  type = 'update'; // update , connection
  notificationCount = 0;

  private hiddenSubscription: Subscription;

  @HostListener('document:click', ['$event'])

  clickedOutside($event: any) {
    // here you can hide your menu
    this.showSearchMobile = false;
  }

  constructor(
    private channelService: ChannelService,
    private renderer: Renderer2,
    private swUpdate: SwUpdate,
    private authService: AuthService,
    private apiBaseService: ApiBaseService,
    private visibilityService: PageVisibilityService,
    public connectionService: ConnectionNotificationService,
    public commonEventService: CommonEventService,
    public notificationService: NotificationService,
    private webSocketService: WebsocketService
  ) {
    super(commonEventService);
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

    // Handle disconnected network use-case
    this.handleOnlineOffline();

    // Handle page hidden case
    this.hiddenSubscription = this.visibilityService.hiddenState$.subscribe(hidden => {
      this.handleBrowserState(!hidden);
    });
  }

  ngOnDestroy(): void {
    this.channelService.unsubscribe();
    this.hiddenSubscription.unsubscribe();
  }

  handleOnlineOffline() {
    window.addEventListener('online', () => this.updateNotifications());
    window.addEventListener('offline', () => this.updateNotifications());
  }

  updateNotifications() {
    const online = navigator.onLine;
    if (online) {
      this.updateDisconnectedData();
    }
  }

  handleBrowserState(isActive) {
    console.log('handle browser state: ', isActive);
    if (isActive) {
      this.updateDisconnectedData();
    }
  }

  updateDisconnectedData() {
    console.log('update disconnected data ...');

    // connection / update notitications count
    this.countCommonNotification()
      .then(() => {
        // get disconnected connection notifications data
        this.notificationService.getDisconnectedNotifications();
        // get disconnected update notifications data
        this.connectionService.getDisconnectedNotifications();
      });

    this.countChatNotification();
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
        this.commonEventService.broadcast({
          channel: 'ChatNotificationComponent',
          action: 'updateNotificationCount',
          payload: this.notificationCount
        })
      });
  }

  subscribeChanneService() {
    this.channelService.subscribe();
    this.webSocketService.createSocket({token: this.authService.user.uuid});

  }

  onShowSideBar(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.addClass(document.body, 'left-sidebar-open');
  }

  onShowSearchMobile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showSearchMobile = true;
  }
}
