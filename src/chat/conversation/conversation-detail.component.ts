import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ChatService } from '../shared/services/chat.service';
import { MessageListComponent } from '../shared/message/message-list.component';
import { MessageEditorComponent } from '../shared/message/editor/message-editor.component';
import { ConversationService } from './conversation.service';
import {
  CommonEvent,
  CommonEventAction,
  CommonEventService,
  PhotoService, UserService
} from '@wth/shared/services';
import { CHAT_ACTIONS, FORM_MODE } from '@wth/shared/constant';
import { User } from '@wth/shared/shared/models';
import { WUploader } from '@shared/services/w-uploader';
import { Message } from '@chat/shared/models/message.model';
import { MessageService } from '@chat/shared/message/message.service';

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
  private sub: any;
  private currentFileId: string;
  private uploadingMessage: any;


  constructor(
    private chatService: ChatService,
    private commonEventService: CommonEventService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private uploader: WUploader
  ) {
    this.currentUser$ = userService.profile$;
  }

  ngOnInit() {
    this.contactSelect$ = this.chatService.getContactSelectAsync();
    this.currentMessages$ = this.chatService.getCurrentMessagesAsync();
    this.chatContactList$ = this.chatService.getChatConversationsAsync();
    // this.route.params.forEach((params: any) => {
    //   let contact = this.chatService.getContactSelect().value;
    //   if (contact) {
    //     this.chatService.getMessages(contact.group_json.id);
    //     if (contact.history) {
    //       this.chatService.updateHistory(contact);
    //     }
    //   // } else {
    //   //   this.router.navigate(['/']);
    //   }
    // });

    this.commonEventSub = this.commonEventService
      .filter((event: CommonEvent) => event.channel == 'chatCommonEvent')
      .subscribe((event: CommonEvent) => {
        this.doEvent(event);
      });

    // capture event while upload
    this.sub = this.uploader.event$.subscribe(event => {
      this.sendFileEvent(event);
    });
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
        if (event.payload.message_type === 'file') {
          this.uploader.cancel(event.payload.meta_data.file);
        }
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


  sendFileEvent(event: any) {

    switch (event.action) {
      case 'start':
        // const files = this.uploader.uppy.getFiles();
        // files.forEach(file => {
        //   const message = new Message({
        //     message: 'Sending file.....',
        //     message_type: 'file',
        //     content_type: file.meta.type,
        //     meta_data: {file: {id: file.id, name: file.name, progress: file.progress, meta: file.meta}}
        //   });
        //   this.chatService.createMessage(null, message).subscribe(response => {
        //     currentMessage = response.data;
        //     console.log('current event message:::', event);
        //   });
        // });
        // const file = event.payload.file;
        break;
      case 'progress':
        const file = event.payload.file;
        if (this.currentFileId !== file.id) {
          console.log('currentfile:::', this.currentFileId);
          this.currentFileId = file.id;
          const message = new Message({
            message: 'Sending file.....',
            message_type: 'file',
            content_type: file.meta.type,
            meta_data: {file: {id: file.id, name: file.name, progress: file.progress, meta: file.meta}}
          });
          this.chatService.createMessage(null, message).subscribe(response => {
            this.uploadingMessage = response.data;
          });
        }
        break;
      case 'success':
        console.log('success:::', event.payload);
        if (this.uploadingMessage &&
          this.uploadingMessage.message_type === 'file' &&
          this.uploadingMessage.sending_status === 1) {
          console.log('upading message here:::', this.uploadingMessage);
          this.messageService.update(this.uploadingMessage).subscribe(response => {
            console.log('sending file success', response.data);
          });
        }
        // update current message
        break;
    }
  }

  buildMessage(event: any): any {
    const message = new Message();

    if (event.action === 'progress') {
      message.message_type = 'file';
      message.content_type = event.payload.content_type;

    }
    return message;
  }

  createMessage(message: any) {
  }

  updateMessage(message: any) {

  }

  deleteMessage(message: any) {

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
    this.sub.unsubscribe();
  }
}
