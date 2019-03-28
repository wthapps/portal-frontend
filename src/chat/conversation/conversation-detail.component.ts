import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute, Params } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Subscription, Observable, Subject, of } from 'rxjs';


import { ChatService } from '../shared/services/chat.service';
import { MessageListComponent } from '../shared/message/message-list.component';
import { MessageEditorComponent } from '../shared/message/editor/message-editor.component';
import { ConversationService } from './conversation.service';
import {
  CommonEvent,
  CommonEventAction,
  CommonEventService,
  PhotoService, UserService, ChatCommonService, StorageService, WMessageService, ApiBaseService
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
  joinedConversationId$: Observable<any>;
  messages$: Observable<any>;

  currentUser$: Observable<User>;
  networkOnline$: Observable<boolean>;
  tokens: any;
  destroy$ = new Subject<any>();
  cursor: number;
  conversationChannel: any;
  conversationId: string;

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
) {
    super(commonEventService);
    this.currentUser$ = userService.profile$;
    this.networkOnline$ = this.storage.getAsync(NETWORK_ONLINE);

    // Load joined conversation then load message list
    this.joinedConversation$ = this.store$.pipe(
      select(ConversationSelectors.selectJoinedConversation),
      filter(conversation => (conversation != null)),
      map((conversation: any) => {

        const cursor = conversation.latest_message.cursor + 1;
        console.log('JOINED CONVERSATION', conversation.latest_message.cursor, cursor);
      //   // update message cursor for joined conversation
        this.store$.dispatch(new MessageActions.SetState({ cursor: cursor}));
        this.store$.dispatch(new ConversationActions.SetState({joinedConversationId: conversation.id}));
      //
      //   // Load messages for joined conversation
      //   this.store$.dispatch(new MessageActions.GetItems({
      //     path: `chat/conversations/${this.conversationId}/messages`, queryParams: {}
      //   }));
      //
      //   setTimeout(() => {
      //     // scroll to bottom
      //     this.store$.dispatch(new MessageActions.UpdateState({scrollable: true}));
      //   }, 200);
      //   this.resetConversationNotifications();
        return conversation;
      })
    );
    this.store$.pipe(
      select(ConversationSelectors.selectJoinedConversationId),
      filter(conversationId => (conversationId != null)),
      takeUntil(this.destroy$),
    ).subscribe(conversationId => {
      console.log('LOAD MESSAGE STATE', conversationId);
      // Load messages for joined conversation
      this.store$.dispatch(new MessageActions.GetItems({
        path: `chat/conversations/${this.conversationId}/messages`, queryParams: {cursor: 0}
      }));

      setTimeout(() => {
        // scroll to bottom
        this.store$.dispatch(new MessageActions.SetState({scrollable: true}));
      }, 200);
      this.resetConversationNotifications();

    });
    // Load message list
    this.messages$ = this.store$.pipe(select(MessageSelectors.selectAllMessages));

  }

  ngOnInit() {
    // Get conversation details such as conversation information and message list
    this.route.params.forEach((params: Params) => {
      this.conversationId = params['id'];
      // Create new channel depends on selected conversation
      // If channel has already been existing don't create new one
      this.conversationChannel = this.websocketService.subscribeChannel(`conversation:${this.conversationId}`,
        {token: this.userService.getSyncProfile().uuid});

      // Join selected conversation channel
      this.conversationChannel.join()
        .receive('ok', ({message}) => {
          console.log('JOIN:::', message);
          // Perform some tasks need to do after joining channel successfully
          this.store$.dispatch(new ConversationActions.GetItem(this.conversationId));
        })
        .receive('error', ({reason}) => console.log('failed join', reason) )
        .receive('timeout', () => console.log('Networking issue. Still waiting...'));

    });

    const presence = new Presence(this.conversationChannel);
    presence.onSync(() => {
      console.log('presence list', presence.list());
    });

    // Handle message created successfully
    this.conversationChannel.on(ChannelEvents.CHAT_MESSAGE_CREATED, (response: any) => {
      console.log(ChannelEvents.CHAT_MESSAGE_CREATED, response);
      const message = response.data.attributes;
      this.createMessageCallback(message);
    });

    // Handle message updated successfully
    this.conversationChannel.on(ChannelEvents.CHAT_MESSAGE_UPDATED, (response: any) => {
      console.log(ChannelEvents.CHAT_MESSAGE_UPDATED, response);
      const message = response.data.attributes;
      this.updateMessageCallback(message);
    });

    // SELECTED CONVERSATION
    // this.chatConversationService.getStoreConversations().pipe(
    //   combineLatest(this.route.params)
    // ).pipe(takeUntil(this.destroy$)).subscribe(([conversations, params]) => {
    //   const conversation = conversations.data.filter(c => !c.blacklist && !c.left && !c.deleted).find(c => +c.group_id === +params.id);
    //   if (conversation) {
    //     this.store.dispatch({ type: CHAT_SELECTED_CONVERSATION_SET, payload: conversation });
    //   }
    // });
    // // Get messages when select
    // this.chatConversationService.getStoreSelectedConversationFull().pipe(takeUntil(this.destroy$)).subscribe(res => {
    //   this.selectedConversation = res.selectedConversation;
    //   if (res.isDifference) {
    //     this.chatMessageService.getMessages(res.selectedConversation.group_id);
    //   }
    //   this.commonEventService.broadcast({
    //     channel: 'MessageEditorComponent',
    //     action: 'focus'
    //   });
    // });

    this.handleMessageEvents();

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
   *     message_type
   * }
   */
  createMessage(message: any) {
    this.store$.dispatch(new MessageActions.Create({
      conversationId: this.conversationId,
      message: message,
    }));
    // this.conversationChannel.push('new_message', message)
    //   .receive('ok', (msg) => {
    //     // this.store$.dispatch(new MessageActions.Create());
    //   })
    //   .receive('error', (reasons) => console.log('create failed', reasons) )
    //   .receive('timeout', () => console.log('Networking issue...') );
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

  declineInvitation(conversation: any) {
    this.store$.dispatch(new ConversationActions.UpdateDisplay({ id: conversation.uuid, body: {
      conversation: {status: 'decline'}
    }}));
    this.router.navigate(['conversations']).then();
  }

  updateDisplay(conversation: any) {
    this.store$.dispatch(new ConversationActions.UpdateDisplay({ id: conversation.uuid, body: {conversation: conversation}}));
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

  private resetConversationNotifications() {
    // update notification_count as read
    this.store$.dispatch(new ConversationActions.UpdateDisplay({
      id: this.conversationId, body: {conversation: {notification_count: 0}}
    }));
  }
}
