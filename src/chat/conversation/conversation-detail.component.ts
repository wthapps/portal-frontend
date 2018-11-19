import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';


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
import { CHAT_ACTIONS, FORM_MODE, CONVERSATION_SELECT, CHAT_MESSAGES_GROUP_ } from '@wth/shared/constant';
import { User } from '@wth/shared/shared/models';
import { WUploader } from '@shared/services/w-uploader';
import { Message } from '@chat/shared/models/message.model';
import { CommonEventHandler } from '@shared/services/common-event/common-event.handler';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { ChatMessageMixin } from '@chat/shared/mixins/chat-message.mixin';

declare var _: any;
declare var $: any;

@Component({
  selector: 'conversation-detail',
  templateUrl: 'conversation-detail.component.html'
})
@Mixins([ChatMessageMixin])
export class ConversationDetailComponent extends CommonEventHandler
  implements ChatMessageMixin, OnInit, OnDestroy {
  @ViewChild('messageList') messageList: MessageListComponent;
  @ViewChild('messageEditor') messageEditor: MessageEditorComponent;
  events: any;
  currentMessages: any;
  groupId: any;
  contactSelect$: Observable<any>;
  currentMessages$: Observable<any>;
  chatContactList$: Observable<any>;
  chatConversations$: Observable<any>;
  currentUser$: Observable<User>;
  tokens: any;
  sub: any;

  constructor(
    private chatService: ChatService,
    public commonEventService: CommonEventService,
    private chatCommonService: ChatCommonService,
    public wMessageService: WMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    public storage: StorageService,
    public apiBaseService: ApiBaseService,
    private conversationService: ConversationService,
    private uploader: WUploader
  ) {
    super(commonEventService);
    this.currentUser$ = userService.profile$;
  }

  updateItemInList:(groupId: any, data: any) => void;
  updateConversationBroadcast:(groupId: any) => Promise<any>;
  updateMessage:(groupId: any, data) => void;

  updateMessageHandler(data: any) {
    this.updateMessage(data.group_id, data);
    // // Scroll to bottom when user's own messages are arrived
    if (data.message.user_id === this.userService.getSyncProfile().id)
      this.commonEventService.broadcast(
        {
          channel: MessageListComponent.name,
          action: 'scrollToBottom',
          payload: true
        }
      )
  }

  ngOnInit() {
    this.contactSelect$ = this.chatService.getContactSelectAsync();
    this.chatConversations$ = this.chatService.getConversationsAsync();
    this.chatContactList$ = this.chatService.getChatConversationsAsync();
    this.route.params.subscribe(params => {
      this.groupId = params.id;
      this.chatService.setConversationSelectedByGroupId(params.id);
    });
  }

  updateCurrent() {
    this.currentMessages$ = this.storage.getAsync(CHAT_MESSAGES_GROUP_ + this.groupId);
  }

  ngOnDestroy() {
    if (this.commonEventSub) this.commonEventSub.unsubscribe();
    if (this.sub) this.sub.unsubscribe();
  }

  deleteMessage(message: any) {
    this.conversationService
          .deleteMessage(message.group_id, message.id)
          .toPromise()
          .then((res: any) => {
            // this.updateCurrentMessage();
          });
  }
  copyMessage(message: any) {
    this.messageEditor.updateAttributes({
          message: message,
          mode: FORM_MODE.CREATE
        });
        this.messageEditor.focus();
        // Real copy
        const temp = $('<input>');
        $('body').append(temp);
        temp.val(message.message).select();
        document.execCommand('copy');
        temp.remove();
  }
  editMessage(message: any) {
    this.messageEditor.updateAttributes({
          message: message,
          mode: FORM_MODE.EDIT
        });
        this.messageEditor.focus();
  }
  cancelMessage(message: any) {
    const { message_type, meta_data, file, group_id, id } = message;
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
