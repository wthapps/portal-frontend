import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription, Observable, Subject } from 'rxjs';


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
import { CHAT_SELECTED_CONVERSATION_SET } from '@core/store/chat/selected-conversation.reducer';

declare var _: any;
declare var $: any;

@Component({
  selector: 'conversation-detail',
  templateUrl: 'conversation-detail.component.html'
})
export class ConversationDetailComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @ViewChild('messageList') messageList: MessageListComponent;
  @ViewChild('messageEditor') messageEditor: MessageEditorComponent;
  @Input() channel = 'ConversationDetailComponent';
  events: any;
  currentMessages: any;
  groupId: any;
  selectedConversation: any;
  currentMessages$: Observable<any>;
  chatConversations$: Observable<any>;
  currentUser$: Observable<User>;
  networkOnline$: Observable<boolean>;
  tokens: any;
  destroy$ = new Subject<any>();

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
    public store: Store<any>,
    public apiBaseService: ApiBaseService,
    private conversationService: ConversationService,
    private uploader: WUploader
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
    // SELECTED CONVERSATION
    this.chatConversationService.getStoreConversations().pipe(
      combineLatest(this.route.params)
    ).pipe(takeUntil(this.destroy$)).subscribe(([conversations, params]) => {
      const conversation = conversations.data.filter(c => !c.blacklist && !c.left && !c.deleted).find(c => +c.group_id === +params.id);
      if (conversation) {
        this.store.dispatch({ type: CHAT_SELECTED_CONVERSATION_SET, payload: conversation });
      }
    });
    // Get messages when select
    this.chatConversationService.getStoreSelectedConversationFull().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.selectedConversation = res.selectedConversation;
      if (res.isDifference) {
        this.chatMessageService.getMessages(res.selectedConversation.group_id);
      }
      this.commonEventService.broadcast({
        channel: 'MessageEditorComponent',
        action: 'focus'
      });
    });
    // sync current message
    this.currentMessages$ = this.chatMessageService.getCurrentMessages();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
