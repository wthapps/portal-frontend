import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute, Params } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Subscription, Observable, Subject, of } from 'rxjs';


import { ChatService } from '../shared/services/chat.service';
import { MessageListComponent } from '../shared/message/message-list.component';
import { MessageEditorComponent } from '../shared/message/editor/message-editor.component';
import { ConversationService } from '@shared/services/chat';
import {
  CommonEvent,
  CommonEventService,
  UserService, StorageService, ApiBaseService
} from '@wth/shared/services';
import { CHAT_ACTIONS, FORM_MODE, CONVERSATION_SELECT, CHAT_MESSAGES_GROUP_, NETWORK_ONLINE } from '@wth/shared/constant';
import { User } from '@wth/shared/shared/models';
import { WUploader } from '@shared/services/w-uploader';
import { Message } from '@chat/shared/models/message.model';
import { CommonEventHandler } from '@shared/services/common-event/common-event.handler';
import { ChatConversationService } from '@chat/shared/services/chat-conversation.service';
import { ChatMessageService } from '@chat/shared/services/chat-message.service';
import * as ConversationSelectors from '@chat/store/conversation/conversation.selectors';
import { AppState } from '@chat/store';
import * as ConversationActions from '@chat/store/conversation/conversation.actions';
import { MessageActions, MessageSelectors } from '@chat/store/message';
import { WebsocketService } from '@shared/channels/websocket.service';
import { Channel, Presence } from 'phoenix';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ChannelEvents } from '@shared/channels';
import { ContactSelectionService } from '@chat/shared/selections/contact/contact-selection.service';
import { MESSAGE_DELETE, MessageEventService } from '@chat/shared/message';
import { UserEventService } from '@shared/user/event';
import { NotificationEventService } from '@shared/services/notification';
import { MemberService } from '@chat/shared/services';

@Component({
  selector: 'conversation-detail',
  templateUrl: 'conversation-detail.component.html'
})
export class ConversationDetailComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @ViewChild('messageList') messageList: MessageListComponent;
  @ViewChild('messageEditor') messageEditor: MessageEditorComponent;

  // @Input() channel = 'ConversationDetailComponent';
  events: any;
  joinedConversation$: Observable<any>;
  messages$: Observable<any>;

  currentUser$: Observable<User>;
  networkOnline$: Observable<boolean>;
  tokens: any;
  destroy$ = new Subject<any>();
  cursor: number;
  conversationChannel: any;
  conversationId: string;
  conversation: any;

  constructor(
    private chatService: ChatService,
    public commonEventService: CommonEventService,
    private chatConversationService: ChatConversationService,
    private chatMessageService: ChatMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    public storage: StorageService,
    private store$: Store<AppState>,
    public apiBaseService: ApiBaseService,
    private conversationService: ConversationService,
    private uploader: WUploader,
    private websocketService: WebsocketService,
    private contactSelectionService: ContactSelectionService,
    private messageEventService: MessageEventService,
    private userEventService: UserEventService,
    private notificationEventService: NotificationEventService,
    private memberService: MemberService
) {
    super(commonEventService);
    this.currentUser$ = userService.profile$;
    this.networkOnline$ = this.storage.getAsync(NETWORK_ONLINE);
    // Load message list
    this.messages$ = this.store$.pipe(select(MessageSelectors.selectAllMessages));
    // Load joined conversation then load message list
    this.joinedConversation$ = this.store$.pipe(
      select(ConversationSelectors.selectJoinedConversation),
      filter(conversation => (conversation != null)),
      map((conversation: any) => {
        // Redirect to chat home if conversation is invalid
        if (this.invalidConversation(conversation)) {
          this.redirectToChatHome();
        }
        const cursor = conversation.latest_message.cursor + 1;
        this.conversation = conversation;
        console.log('SELECTED CONVERSATION:::', conversation.uuid, this.conversation);
        // update message cursor for joined conversation
        this.store$.dispatch(new MessageActions.SetState({ cursor: cursor}));
        this.store$.dispatch(new ConversationActions.SetState({joinedConversationId: conversation.uuid}));
        return conversation;
      })
    );
    this.store$.pipe(
      select(ConversationSelectors.selectJoinedConversationId),
      filter(conversationId => (conversationId != null)),
      takeUntil(this.destroy$),
    ).subscribe(conversationId => {
      // Load messages for joined conversation
      console.log('load conversation detail', conversationId);
      this.conversationId = conversationId;
      this.store$.dispatch(new MessageActions.GetItems({
        path: `chat/conversations/${this.conversationId}/messages`, queryParams: {cursor: 0}
      }));
      // console.log('CONVERSATION ID:::', conversationId, this.conversationId);
      setTimeout(() => {
        // scroll to bottom
        // this.store$.dispatch(new MessageActions.SetState({scrollable: true}));
        this.commonEventService.broadcast({
          channel: 'MessageEditorComponent',
          action: 'resetEditor'
        });
      }, 200);
      this.resetConversationNotifications();
    });
  }

  ngOnInit() {
    // Get conversation details such as conversation information and message list
    this.route.params.forEach((params: Params) => {
      this.conversationId = params['id'];
      // Create new channel depends on selected conversation
      // If channel has already been existing don't create new one
      this.connectConversationChannel();
      // Join selected conversation channel
      this.conversationChannel.join()
        .receive('ok', ({message}) => {
          // Perform some tasks need to do after joining channel successfully
          this.store$.dispatch(new ConversationActions.GetItem(this.conversationId));
          this.handleConversationChannelEvents();
        })
        .receive('error', ({reason}) => console.log('failed join', reason) )
        .receive('timeout', () => console.log('Networking issue. Still waiting...'));
    });
    this.handleMessageEvents();
    // TODO present list
    const presence = new Presence(this.conversationChannel);
    presence.onSync(() => {
      console.log('presence list', presence.list());
    });
  }

  connectConversationChannel() {
    this.conversationChannel = this.websocketService.subscribeChannel(`conversation:${this.conversationId}`,
      {token: this.userService.getSyncProfile().uuid});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TEXT = 'text'
  // FILE = 'file'
  // NOTIFICATION = 'notification'
  // CREATED_CONVERSATION = 'created_conversation'
  // REQUEST = 'request'
  // SHARE_CONTACT_MESSAGE = 'share_contact_message'
  // REQUEST_ACCEPTED = 'request_accepted',
  // MESSAGE_DELETED = 'message_deleted'
  /**
   * Create new message then broadcast to members in being joining conversation
   * @param message: {
   *   message_type
   * }
   */
  createMessage(message: any) {
    this.store$.dispatch(new MessageActions.Create({
      conversationId: this.conversationId,
      message: message,
    }));
  }

  createMessageCallback(message: any) {
    this.store$.dispatch(new MessageActions.CreateSuccess({message: message}));
    this.store$.dispatch(new MessageActions.SetState({scrollable: true}));
    this.resetConversationNotifications();
  }

  updateMessage(message: any) {
    this.store$.dispatch(new MessageActions.Update({message: message}));
  }

  updateMessageCallback(message: any) {
    this.store$.dispatch(new MessageActions.UpdateSuccess({message: message}));
  }

  handleMessageEvents() {
    // Update message
    this.messageEventService.update$.pipe(takeUntil(this.destroy$)).subscribe((payload: any) => {
      this.store$.dispatch(new MessageActions.Update({ conversationId: this.conversationId, message: payload.data }));
    });

    // Delete message
    this.messageEventService.delete$.pipe(takeUntil(this.destroy$)).subscribe((payload: any) => {
      this.store$.dispatch(new MessageActions.Delete({ conversationId: this.conversationId, message: payload.data }));
    });
  }

  handleConversationChannelEvents() {
    // Handle message created successfully
    this.conversationChannel.on(ChannelEvents.CHAT_MESSAGE_CREATED, (response: any) => {
      const message = response.data.attributes;
      console.log(ChannelEvents.CHAT_MESSAGE_CREATED, message, this.conversation);
      if (this.conversation.id === message.group_id) {
        this.createMessageCallback(message);
      }
    });

    // Handle message updated successfully
    this.conversationChannel.on(ChannelEvents.CHAT_MESSAGE_UPDATED, (response: any) => {
      // console.log(ChannelEvents.CHAT_MESSAGE_UPDATED, response);
      const message = response.data.attributes;
      this.updateMessageCallback(message);
    });

    // Handle message updated successfully
    this.conversationChannel.on(ChannelEvents.CHAT_CONVERSATION_ACCEPTED, (response: any) => {
      // console.log(ChannelEvents.CHAT_CONVERSATION_ACCEPTED, response);
      const conversation = response.data.attributes;
      this.acceptInvitationCallback(conversation);
    });
  }



  cancelMessage(event: CommonEvent) {
    const { message_type, meta_data, file, group_id, id } = event.payload;
    if (message_type === 'file' && file && meta_data.file) {
      this.uploader.cancel(meta_data.file);
    }
    this.conversationService
      .cancelUpload(group_id, id)
      .toPromise()
      .then((response: any) => {
      });
  }

  buildMessage(event: any): any {
    const message = new Message();

    if (event.action === 'progress') {
      message.message_type = 'file';
      message.content_type = event.payload.content_type;

    }
    return message;
  }

  /*
   * Conversation actions
   */

  acceptInvitation(conversation: any) {
    this.store$.dispatch(new ConversationActions.AcceptInvitation({ id: conversation.uuid }));
  }

  acceptInvitationCallback(conversation: any) {
    // this.store$.dispatch(new ConversationActions.UpdateDisplay({ id: conversation.uuid, body: {
    //   conversation: {status: 'accepted'}
    // }}));
    // console.log('USER:::', conversation);
    if (this.conversationId === conversation.uuid) {
      this.store$.dispatch(new ConversationActions.UpdateDisplaySuccess({conversation: conversation}));
      // Just reload messages on receiver's side

      if (this.userService.getSyncProfile().id !== conversation.creator_id) {
        this.store$.dispatch(new MessageActions.GetItems({
          path: `chat/conversations/${this.conversationId}/messages`, queryParams: {cursor: 0}
        }));
      }
    }
  }

  declineInvitation(conversation: any) {
    this.store$.dispatch(new ConversationActions.UpdateDisplay({ id: conversation.uuid, body: {
      conversation: {status: 'decline'}
    }}));
    this.redirectToChatHome();
  }

  updateDisplay(conversation: any) {
    this.store$.dispatch(new ConversationActions.UpdateDisplay({ id: conversation.uuid, body: {conversation: conversation}}));

    if (conversation.hidden || conversation.deleted || conversation.left) {
      this.redirectToChatHome();
      this.store$.dispatch(new ConversationActions.DeleteSuccess({ conversation: conversation}));
    }
  }

  leaveConversation(conversation: any) {
    // this.store$.dispatch(new ConversationActions.Leave({ conversationId: conversation.uuid}));
    this.memberService.leave(conversation.uuid).pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.redirectToChatHome();
      this.store$.dispatch(new ConversationActions.DeleteSuccess({ conversation: conversation}));
    });

  }
   /*
   * Conversation actions ending
   */

  openContactSelection(conversation: any) {
    this.contactSelectionService.open({
      type: 'ADD_MEMBER',
      title: 'Add Members',
      path: `chat/conversations/${conversation.uuid}/members/my_contacts`
    });
  }

  viewProfile(user: any) {
    this.userEventService.viewProfile(user);
  }

  redirectToChatHome() {
    this.router.navigate(['conversations']).then();
  }

  drop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer.files;
    if (data.length > 0) {
      this.chatService.createUploadingFile(data);
    }
    return false;
  }

  drag(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  private invalidConversation(conversation: any) {
    if (conversation.status === 'decline' || conversation.left) {
      return true;
    }
    return false;
  }
  private resetConversationNotifications() {
    // update notification_count as read
    this.store$.dispatch(new ConversationActions.UpdateDisplay({
      id: this.conversationId, body: {conversation: {notification_count: 0}}
    }));

    // update chat notification count
    if (this.conversation && this.conversation.notification_count > 0) {
      this.notificationEventService.updateNotificationCount({count: 1, type: 'remove'});
    }
  }
}
