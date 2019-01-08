import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CHAT_CONVERSATIONS, Constants, STORE_CONVERSATIONS } from '@shared/constant';
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
import { Store } from '@ngrx/store';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { Conversations } from '@shared/shared/models/chat/conversations.list.model';
import { SET_CHAT_CONVERSATIONS } from '@core/store/chat/conversations.reducer';

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
    private chatCommonService: ChatCommonService,
    public commonEventService: CommonEventService,
    private router: Router,
    private storageService: StorageService,
    private store: Store<any>,
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
    // in chat only
    this.store.select(STORE_CONVERSATIONS).pipe(takeUntil(this.destroy$)).subscribe((conversations: Conversations) => {
      if (conversations) {
        this.inChat = true;
        this.notificationCount = conversations.getAllNotifications();
      }
    })
  }

  updateNotificationCount(data: any){
    this.notificationCount = data;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNotification(res: any){
    if(!this.inChat) this.notificationCount += 1;
  }

  gotoChat() {
    this.navigateService.navigateOrRedirect('conversations', 'chat');
    // $('#chat-header-notification').removeClass('open');
  }

  toggleViewNotifications() {
    this.apiBaseService.get('zone/chat/contacts').pipe(map(res => new Conversations(res))).subscribe((conversations: Conversations) => {
      this.conversations = conversations;
      this.links = conversations.meta.links;
    })
  }

  markAllAsRead() {
    this.apiBaseService
      .addCommand(ConversationApiCommands.markAllAsRead())
      .subscribe(res => {
        this.notificationCount = 0;
        this.conversations.markAllAsRead();
        if (this.inChat) this.updateChatStore();
      });
  }

  markAsRead(c: Conversation) {
    const group_id = c.group.id;
    this.apiBaseService
      .addCommand(ConversationApiCommands.markAsRead({ id: group_id }))
      .subscribe((res: any) => {
        this.conversations.markAsRead(group_id);
        this.notificationCount = this.conversations.getAllNotifications();
        if (this.inChat) this.updateChatStore();
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
      )
      .subscribe((res: any) => {
        c.notification = res.data.notification;
        this.conversations.update(c);
        if (this.inChat) this.updateChatStore();
      });
  }

  updateChatStore(): void {
    this.store.dispatch({ type: SET_CHAT_CONVERSATIONS, payload: this.conversations})
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
