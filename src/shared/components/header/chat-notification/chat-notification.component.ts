import { Component, OnInit, Input, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Constants } from '@shared/constant';
import { WTHNavigateService } from '@shared/services/wth-navigate.service';
import { NotificationService } from '@shared/services/notification.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Conversation } from '@chat/shared/models/conversation.model';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { Observable } from 'rxjs/Observable';
import { AuthService, CommonEventHandler, CommonEventService, CommonEvent } from '@shared/services';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ConversationService } from '@shared/services/chat';
import { select, Store } from '@ngrx/store';
import { NotificationActions, NotificationSelectors } from '@core/store/notification';
import { AppState } from '@chat/store';
import { NotificationEventService } from '@shared/services/notification';
import { ChannelEvents } from '@shared/channels';
import { WebsocketService } from '@shared/channels/websocket.service';

declare var $: any;

@Component({
  selector: 'chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss'],
  providers: [ConversationService]
})
export class ChatNotificationComponent extends CommonEventHandler implements OnInit, AfterViewInit, OnDestroy {
  readonly tooltip: any = Constants.tooltip;
  readonly urls: any = Constants.baseUrls;
  conversations = [];
  conversations$: Observable<any>;
  loading$: Observable<any>;
  loadingMore$: Observable<any>;
  noData$: Observable<any>;

  notificationCount = 0;
  links: any;
  inChat = false;
  nextLink: string;
  destroy$ = new Subject();
  emojiMap$: Observable<{ [name: string]: WTHEmojiCateCode }>;
  isShowing = false;
  userChannel: any;

  constructor(
    private navigateService: WTHNavigateService,
    private apiBaseService: ApiBaseService,
    public commonEventService: CommonEventService,
    public notificationService: NotificationService,
    public wthNavigateService: WTHNavigateService,
    public authService: AuthService,
    private wthEmojiService: WTHEmojiService,
    private conversationService: ConversationService,
    private store$: Store<AppState>,
    private notificationEventService: NotificationEventService,
    private websocketService: WebsocketService
  ) {
    super(commonEventService);
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    this.loading$ = this.store$.pipe(select(NotificationSelectors.selectIsLoading));
    this.loadingMore$ = this.store$.pipe(select(NotificationSelectors.selectIsLoadingMore));
    this.conversations$ = this.store$.pipe(select(NotificationSelectors.selectAllNotifications));
    this.noData$ = this.store$.pipe(select(NotificationSelectors.selectIsNoData));
    this.store$.pipe(select(NotificationSelectors.getLinks), takeUntil(this.destroy$)).subscribe(links => {
      this.nextLink = links.next;
    });
    this.notificationEventService.markAllAsRead$.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.markAllAsReadCallBack();
    });

    this.notificationEventService.updateNotificationCount$.pipe(takeUntil(this.destroy$)).subscribe(notification => {
      this.updateNotificationCountCallBack(notification);
    });
  }

  ngAfterViewInit(): void {
    this.apiBaseService.get('chat/notifications/count')
      .subscribe((res: any) => {
        this.notificationCount = res.data.count;
      });
    // handle chat message notification
    // set timeout to make sure userChannel is always available
    setTimeout(() => {
      this.websocketService.userChannel.on(ChannelEvents.CHAT_CONVERSATION_UPSERTED, (response: any) => {
        const conversation = response.data.attributes;
        if (conversation.notification_count > 0) {
          // if be current conversation will not add notification
          if (window.location.pathname.indexOf(conversation.uuid) > -1) {
            return;
          }
          this.updateNotificationCountCallBack({count: 1, type: 'add'});
        }
      });
    }, 500);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNotificationEvent(event: CommonEvent) {
    this.addNotification(event.payload);
  }

  addNotification(res: any) {
    this.notificationCount = this.notificationCount + (res.notification_count - res.last_notification_count);
  }

  gotoChat() {
    this.navigateService.navigateOrRedirect('conversations', 'chat');
  }

  toggleViewNotifications() {
    this.store$.dispatch(new NotificationActions.LoadItems({ query: {}}));
  }

  getMore() {
    if (this.nextLink) {
      this.store$.dispatch(new NotificationActions.LoadMoreItems({ path: this.nextLink }));
    }
  }

  markAllAsRead() {
    this.notificationEventService.markAllAsRead();
  }

  markAllAsReadCallBack() {
    // Clear notification count on Top right
    // And current conversations' notification count as well
    this.store$.dispatch(new NotificationActions.MarkAllAsReadSuccess({}));
    this.notificationCount = 0;
  }

  markAsRead(conversation: Conversation) {
    this.store$.dispatch(new NotificationActions.MarkAsRead({id: conversation.uuid}));
    this.notificationEventService.markAsRead(conversation);
    this.notificationCount = this.notificationCount - conversation.notification_count;
  }

  updateNotificationCountCallBack(notification: {count: number, type: 'add'|'remove'}) {
    if (notification.type === 'add') {
      this.notificationCount += notification.count;
    } else if (notification.type === 'remove') {
      const newNotificationCount = this.notificationCount - notification.count;
      this.notificationCount = newNotificationCount < 0 ? 0 : newNotificationCount;

    }
  }

  navigate(conversation: any) {
    $('#chat-header-notification').removeClass('open');
    this.wthNavigateService.navigateOrRedirect(
      `conversations/${conversation.uuid}`,
      'chat'
    );
  }

  hideActionsMenu(e: any) {
    e.stopPropagation();
    e.preventDefault();
    $('#chat-header-notification')
      .find('ul.dropdown-menu')
      .hide();
  }

  subToggle(e: any) {
    e.stopPropagation();
    e.preventDefault();
    $(e.target)
      .next('ul')
      .toggle();
    $('#chat-header-notification')
      .find('ul.dropdown-menu')
      .not($(e.target).next('ul'))
      .hide();
  }
}
