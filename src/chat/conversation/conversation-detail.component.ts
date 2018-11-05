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
  PhotoService, UserService, ChatCommonService, StorageService
} from '@wth/shared/services';
import { CHAT_ACTIONS, FORM_MODE, CONVERSATION_SELECT, CHAT_MESSAGES_GROUP_, CURRENT_CHAT_MESSAGES } from '@wth/shared/constant';
import { User } from '@wth/shared/shared/models';
import { WUploader } from '@shared/services/w-uploader';
import { Message } from '@chat/shared/models/message.model';
import { ConversationDetailService } from './conversation-detail.service';
// import { ConversationDetailService } from '@chat/conversation/conversation-detail.service';

declare var _: any;
declare var $: any;

@Component({
  selector: 'conversation-detail',
  templateUrl: 'conversation-detail.component.html'
})
export class ConversationDetailComponent
  implements CommonEventAction, OnInit, OnDestroy {
  @ViewChild('messageList') messageList: MessageListComponent;
  @ViewChild('messageEditor') messageEditor: MessageEditorComponent;
  events: any;

  commonEventSub: Subscription;
  contactSelect$: Observable<any>;
  currentMessages$: Observable<any>;
  chatContactList$: Observable<any>;
  currentUser$: Observable<User>;
  tokens: any;
  sub: any;

  constructor(
    private chatService: ChatService,
    private commonEventService: CommonEventService,
    private chatCommonService: ChatCommonService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private storage: StorageService,
    private conversationService: ConversationService,
    private conversationDetailService: ConversationDetailService,
    private uploader: WUploader
  ) {
    this.currentUser$ = userService.profile$;
  }

  ngOnInit() {
    this.contactSelect$ = this.chatService.getContactSelectAsync();
    this.currentMessages$ = this.chatService.getCurrentMessagesAsync();
    this.chatContactList$ = this.chatService.getChatConversationsAsync();
    this.conversationDetailService.setComponent(this);

    this.commonEventSub = this.commonEventService
      .filter((event: CommonEvent) => event.channel === 'chatCommonEvent')
      .subscribe((event: CommonEvent) => {
        this.doEvent(event);
      });

  }
  ngOnDestroy() {
    this.commonEventSub.unsubscribe();
    this.sub.unsubscribe();
  }
  doEvent(event: CommonEvent) {
    switch (event.action) {
      case CHAT_ACTIONS.CHAT_MESSAGE_COPY:
        this.messageEditor.updateAttributes({
          message: event.payload,
          mode: FORM_MODE.CREATE
        });
        this.messageEditor.focus();
        // Real copy
        const temp = $('<input>');
        $('body').append(temp);
        temp.val(event.payload.message).select();
        document.execCommand('copy');
        temp.remove();
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_QUOTE:
        _.assign(event.payload, { is_quote: true });
        this.messageEditor.updateAttributes({
          message: event.payload,
          mode: FORM_MODE.CREATE
        });
        this.messageEditor.focus();
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_EDIT:
        this.messageEditor.updateAttributes({
          message: event.payload,
          mode: FORM_MODE.EDIT
        });
        this.messageEditor.focus();
        this.updateCurrentMessage();
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_DOWNLOAD:
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_CANCEL: {
        const { message_type, meta_data, file, group_id, id } = event.payload;
        if (message_type === 'file' && file && meta_data.file) {
          this.uploader.cancel(meta_data.file);
        }
        this.conversationService
          .cancelUpload(group_id, id)
          .toPromise()
          .then((response: any) => {
            this.updateCurrentMessage();
          });
        }
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_DELETE:
        this.conversationService
          .deleteMessage(event.payload.group_id, event.payload.id)
          .toPromise()
          .then((res: any) => {
            this.updateCurrentMessage();
          });

        break;
    }
  }

  private updateCurrentMessage() {
    const groupId = this.storage.getValue(CONVERSATION_SELECT).group_id;
    this.storage.find(CURRENT_CHAT_MESSAGES).value.data = _.cloneDeep(this.storage.getValue(CHAT_MESSAGES_GROUP_ + groupId)).data;
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
