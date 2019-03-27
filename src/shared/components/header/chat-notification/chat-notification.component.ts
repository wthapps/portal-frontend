import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Constants } from '@shared/constant';
import { WTHNavigateService } from '@shared/services/wth-navigate.service';
import { ConnectionNotificationService } from '@shared/services/connection-notification.service';
import { NotificationService } from '@shared/services/notification.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { ConversationApiCommands } from '@shared/commands/chat/coversation-commands';
import { HandlerService } from '@shared/services/handler.service';
import { Conversation } from '@chat/shared/models/conversation.model';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { Observable } from 'rxjs/Observable';
import { AuthService, CommonEventHandler, CommonEventService, CommonEvent } from '@shared/services';
import { Subject } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { ConversationService } from '@chat/conversation/conversation.service';

declare var $: any;

@Component({
  selector: 'chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss'],
  providers: [ConversationService]
})
export class ChatNotificationComponent extends CommonEventHandler implements OnInit, OnDestroy {
  readonly tooltip: any = Constants.tooltip;
  readonly urls: any = Constants.baseUrls;
  conversations = [];
  conversations$: Observable<any>;
  notificationCount = 0;
  links: any;
  inChat = false;
  nextLink: string;
  channel: any = 'ChatNotificationComponent';
  destroy$ = new Subject();
  emojiMap$: Observable<{ [name: string]: WTHEmojiCateCode }>;

  constructor(
    private navigateService: WTHNavigateService,
    private apiBaseService: ApiBaseService,
    public commonEventService: CommonEventService,
    public connectionService: ConnectionNotificationService,
    public notificationService: NotificationService,
    public handlerService: HandlerService,
    public wthNavigateService: WTHNavigateService,
    public authService: AuthService,
    private wthEmojiService: WTHEmojiService,
    private conversationService: ConversationService,
  ) {
    super(commonEventService);
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    //
  }

  updateNotificationCount(event: CommonEvent) {
    this.notificationCount = event.payload;
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
    this.conversations$ = this.conversationService.getAll({per_page: 8}).pipe(
      map(response => {
        this.nextLink = response.links.next;
        this.conversations = response.data.map(con => con.attributes);
        return this.conversations;
      })
    );
  }

  getMore() {
    if (this.nextLink) {
      this.conversations$ = this.conversationService.getAll({}, this.nextLink).pipe(
        map(response => {
          this.nextLink = response.links.next;
          this.conversations.push(...(response.data.map(con => con.attributes)));
          return this.conversations;
        })
      );
    }
  }

  markAllAsReadEvent(event: CommonEvent) {
    // this.markAllAsRead(event.payload);
  }

  markAllAsRead() {
    this.apiBaseService.post('chat/notifications/mark_all_as_read').pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
        // this.notificationCount = 0;
        // if (conversations) {
        //   this.conversations = conversations;
        // }
        // this.conversations.markAllAsRead();
        // this.updateChatStore();
      });
  }

  markAsReadEvent(event: CommonEvent) {
    this.markAsRead(event.payload);
  }

  markAsRead(c: Conversation) {
    const group_id = c.group_id;
    this.apiBaseService
      .post('zone/chat/notification/mark_as_read', { id: group_id })
      .subscribe((res: any) => {
        // this.conversations.markAsRead(group_id);
        this.notificationCount = this.notificationCount + res.data.notification_count - res.data.last_notification_count;
        this.updateChatStore();
      });
  }

  updateNotification(c: Conversation) {
    const group_id = c.group_id;
    this.apiBaseService
      .addCommand(
        ConversationApiCommands.updateNotification({
          id: group_id,
          notification: !c.notification
        })
      ).subscribe((res: any) => {
        c.notification = res.data.notification;
        // this.conversations.update(c);
        this.updateChatStore();
      });
  }

  updateChatStore(): void {
    this.commonEventService.broadcast({
      channel: 'ChatConversationService',
      action: 'updateStoreConversationsEvent',
      payload: this.conversations
    });
  }



  navigate(conversation: any) {
    $('#chat-header-notification').removeClass('open');
    this.wthNavigateService.navigateOrRedirect(
      `conversations/${conversation.group_id}`,
      'chat'
    );
    this.handlerService.triggerEvent('on_conversation_select', conversation);
  }

  hideActionsMenu(e: any) {
    e.stopPropagation();
    e.preventDefault();
    $('#chat-header-notification')
      .find('ul.dropdown-menu')
      .hide();
  }

  parentHide(event: any) {

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
