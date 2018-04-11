import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';

import { ChatService } from '../shared/services/chat.service';
import { MessageListComponent } from '../shared/message/message-list.component';
import { MessageEditorComponent } from '../shared/message/editor/message-editor.component';
import { ConversationService } from './conversation.service';
import {
  CommonEvent,
  CommonEventAction,
  CommonEventService,
  PhotoService
} from '@wth/shared/services';
import { CHAT_ACTIONS, FORM_MODE } from '@wth/shared/constant';
import { Store } from '@ngrx/store';
import * as fromConversations from './../../core/store/chat/conversations.reducer';
import { User } from '@shared/shared/models';
import { ChatGroupModel } from '@shared/shared/models/chat/chat-group.model';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'conversation-detail',
  templateUrl: 'conversation-detail.component.html'
})
export class ConversationDetailComponent
  implements CommonEventAction, OnInit, OnDestroy {
  @ViewChild('messageList') messageList: MessageListComponent;
  @ViewChild('messageEditor') messageEditor: MessageEditorComponent;
  item: any;
  events: any;

  commonEventSub: Subscription;
  tokens: any;

  constructor(
    private chatService: ChatService,
    private commonEventService: CommonEventService,
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private store: Store<any>,
    private conversationService: ConversationService
  ) {
    // this.store.select('conversations').subscribe((state: any) => {
    //   console.log(state);
    // });
  }

  ngOnInit() {
    this.route.params.forEach((params: any) => {
      let contact = this.chatService.getContactSelect().value;
      if (contact) {
        this.chatService.getMessages(contact.group_json.id);
        if (contact.history) {
          this.chatService.updateHistory(contact);
        }
      }
    });

    this.commonEventSub = this.commonEventService
      .filter((event: CommonEvent) => event.channel == 'chatCommonEvent')
      .subscribe((event: CommonEvent) => {
        this.doEvent(event);
      });
    this.item = this.chatService.getCurrentMessages();
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
        let temp = $('<input>');
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
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_DOWNLOAD:
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_CANCEL:
        this.conversationService
          .cancelUpload(event.payload.group_id, event.payload.id)
          .toPromise()
          .then((response: any) => {
            console.log('cancel ok!!!!');
          });
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_DELETE:
        this.conversationService
          .deleteMessage(event.payload.group_id, event.payload.id)
          .toPromise()
          .then((response: any) => {
            console.log('delete ok!!!!');
          });

        break;
    }
  }

  drop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    let data = e.dataTransfer.files;
    if (data.length > 0) {
      this.chatService.createUploadingFile(data);
    }
    return false;
  }

  drag(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.commonEventSub.unsubscribe();
  }
}
