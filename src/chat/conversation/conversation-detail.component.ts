import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
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
import {
  CHAT_ACTIONS, FORM_MODE, CONVERSATION_SELECT, CHAT_MESSAGES_GROUP_, NETWORK_ONLINE,
  STORE_CONVERSATIONS, STORE_CONTEXT
} from '@wth/shared/constant';
import { User } from '@wth/shared/shared/models';
import { WUploader } from '@shared/services/w-uploader';
import { Message } from '@chat/shared/models/message.model';
import { CommonEventHandler } from '@shared/services/common-event/common-event.handler';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { ChatConversationService } from '@chat/shared/services/chat-conversation.service';
import { merge, mergeMap, mergeMapTo, map, filter, withLatestFrom, combineLatest, takeUntil } from 'rxjs/operators';
import { ChatMessageService } from '@chat/shared/services/chat-message.service';
import * as ConversationSelectors from '@chat/store/conversation/conversation.selectors';
import { AppState } from '@chat/store';
import * as ConversationActions from '@chat/store/conversation/conversation.actions';
import { MessageActions, MessageSelectors } from '@chat/store/message';
import { WebsocketService } from '@shared/channels/websocket.service';
import { Channel, Presence } from 'phoenix';
import { filter, map, skip, take } from 'rxjs/operators';
import { ChannelEvents } from '@shared/channels';

declare var $: any;

@Component({
  selector: 'conversation-detail',
  templateUrl: 'conversation-detail.component.html'
})
export class ConversationDetailComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @ViewChild('messageList') messageList: MessageListComponent;
  @ViewChild('messageEditor') messageEditor: MessageEditorComponent;
  // @Input() channel = 'ConversationDetailComponent';
  events: any;
  currentMessages: any;
  groupId: any;
  selectedConversation: any;
  selectedConversation$: Observable<any>;
  messages$: Observable<any>;

  chatConversations$: Observable<any>;
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
    public wMessageService: WMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    public storage: StorageService,
    // public store: Store<any>,
    private store$: Store<AppState>,
    public apiBaseService: ApiBaseService,
    private conversationService: ConversationService,
    private uploader: WUploader,
    private websocketService: WebsocketService
  ) {
    super(commonEventService);
    this.currentUser$ = userService.profile$;
    this.networkOnline$ = this.storage.getAsync(NETWORK_ONLINE);
  }

  updateMessageHandler(event: CommonEvent) {
    // this.updateMessage(data.group_id, data);
    this.chatMessageService.addCurrentMessages(event.payload);
    // // Scroll to bottom when user's own messages are arrived
    if (event.payload.message.user_id === this.userService.getSyncProfile().id) {
      this.commonEventService.broadcast(
        {
          channel: 'MessageListComponent',
          action: 'scrollToBottom',
          payload: true
        }
      );
    }
  }

  ngOnInit() {
    // Get conversation details such as conversation information and message list

    this.messages$ = this.store$.select(MessageSelectors.selectAllMessages);


    this.route.params.forEach((params: Params) => {
      this.conversationId = params['id'];

      // Always plus 1 to make sure it is greater than current message cursor
      this.selectedConversation$ = this.store$.pipe(
        select(ConversationSelectors.getSelectedConversation),
        map(response => {
          console.log('GET SELECTED CONVERSATION', response);
          return response;
        })
      );

      this.store$.dispatch(new MessageActions.GetItems({ groupId: this.conversationId, queryParams: {
          cursor: 1551780895167 + 1
        }}));

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

    this.conversationChannel.on(ChannelEvents.CHAT_MESSAGE_CREATED, (response: any) => {

      console.log(ChannelEvents.CHAT_MESSAGE_CREATED, response);
      const message = response.data.attributes;


      this.createMessageCallback(message);
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

  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Conversation actions handle

  doAccept(conversation: any) {
    console.log('ACCTEPTED');
    this.store$.dispatch(new ConversationActions.AcceptInvitation(conversation));
    // this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(contact => {
    //   this.chatConversationService.acceptRequest(contact).then(res => {
    //     this.chatMessageService.getMessages(contact.group_id)
    //   });
    // })
  }

  doDecline(conversation: any) {
    this.store$.dispatch(new ConversationActions.DeclineInvitation(conversation));
    console.log('DECLINED');
    // this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(contact => {
    //   this.chatConversationService.declineRequest(contact);
    // })
  }

  // Conversation action handle end


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
  }

  updateMessage(message: any) {

  }

  deleteMessage(event: CommonEvent) {
    this.chatMessageService
      .deleteMessage(event.payload.group_id, event.payload.id)
      .toPromise()
      .then((res: any) => {
        // this.updateCurrentMessage();
      });
  }
  copyMessage(event: CommonEvent) {
    this.messageEditor.updateAttributes({
      message: event.payload,
      mode: FORM_MODE.CREATE
    });
    this.messageEditor.focus();
    // Real copy
    const temp = $('<input>');
    $('body').append(temp);
    temp.val(event.payload).select();
    document.execCommand('copy');
    temp.remove();
  }

  editMessage(event: CommonEvent) {
    this.messageEditor.updateAttributes({
      message: event.payload,
      mode: FORM_MODE.EDIT
    });
    this.messageEditor.focus();
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


  showEditorError(error: any) {

  }

  /*
   * Conversation actions
   */

  favorite(conversation: any) {
    this.store$.dispatch(new ConversationActions.UpdateSelf({id: conversation.id, body: {favorite: conversation.favorite}}));
  }

  toggleNotification(conversation: any) {
    this.store$.dispatch(new ConversationActions.UpdateSelf({id: conversation.id, body: {notification: conversation.notification}}));
  }

  /*
   * Conversation actions ending
   */

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
}
