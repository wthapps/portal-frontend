import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Constants } from '@shared/constant';
import { WTHNavigateService } from '@shared/services/wth-navigate.service';
import { Router } from '@angular/router';
import { ConnectionNotificationService } from '@shared/services/connection-notification.service';
import { NotificationService } from '@shared/services/notification.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { ConversationApiCommands } from '@shared/commands/chat/coversation-commands';
import { StorageService } from '@shared/services/storage.service';
import { HandlerService } from '@shared/services/handler.service';
import { Conversation } from '@chat/shared/models/conversation.model';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { Observable } from 'rxjs/Observable';
import { AuthService, ChatCommonService, CommonEventHandler, CommonEventService } from '@shared/services';
import { Subject } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { Conversations } from '@shared/shared/models/chat/conversations.model';

declare var $: any;

@Component({
  selector: 'chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.scss']
})
export class ChatNotificationComponent extends CommonEventHandler implements OnInit, OnDestroy {
  readonly tooltip: any = Constants.tooltip;
  readonly defaultAvatar: string = Constants.img.avatar;
  readonly urls: any = Constants.baseUrls;
  conversations: Conversations = new Conversations();
  notificationCount = 0;
  links: any;
  inChat: boolean = false;
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
    private wthEmojiService: WTHEmojiService
  ) {
    super(commonEventService);
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    //
  }

  updateNotificationCount(data: any){
    this.notificationCount = data;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNotification(res: any){
    this.notificationCount = this.notificationCount + (res.notification_count - res.last_notification_count);
  }

  gotoChat() {
    this.navigateService.navigateOrRedirect('conversations', 'chat');
  }

  toggleViewNotifications() {
    this.apiBaseService.get('zone/chat/group').pipe(map(res => new Conversations(res))).subscribe((conversations: Conversations) => {
      this.conversations = conversations;
      this.links = conversations.meta.links;
    })
  }

  markAllAsRead(conversations?: Conversations) {
    this.apiBaseService.post('zone/chat/notification/mark_all_as_read')
      .subscribe(res => {
        this.notificationCount = 0;
        if (conversations) {
          this.conversations = conversations;
        }
        this.conversations.markAllAsRead();
        this.updateChatStore();
      });
  }

  markAsRead(c: Conversation) {
    const group_id = c.group.id;
    this.apiBaseService
      .post('zone/chat/notification/mark_as_read', {id: group_id})
      .subscribe((res: any) => {
        this.conversations.markAsRead(group_id);
        this.notificationCount = this.notificationCount + res.data.notification_count - res.data.last_notification_count;
        this.updateChatStore();
      });
  }

  updateNotification(c: Conversation) {
    const group_id = c.group.id;
    this.apiBaseService
      .addCommand(
        ConversationApiCommands.updateNotification({
          id: group_id,
          notification: !c.notification
        })
      ).subscribe((res: any) => {
        c.notification = res.data.notification;
        this.conversations.update(c);
        this.updateChatStore();
      });
  }

  updateChatStore(): void {
    this.commonEventService.broadcast({
      channel: 'ChatConversationService',
      action: 'updateStoreConversations',
      payload: this.conversations
    })
  }

  getMore() {
    if (this.links && this.links.next) {
      this.apiBaseService.get(this.links.next).subscribe((res: any) => {
        this.conversations.data = [...this.conversations.data, ...res.data];
        this.links = res.meta.links;
      });
    }
  }

  navigate(conversation: any) {
    $('#chat-header-notification').removeClass('open');
    this.wthNavigateService.navigateOrRedirect(
      `conversations/${conversation.group.id}`,
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

  parentHide(event: any){

  }

  private subToggle(e: any) {
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
