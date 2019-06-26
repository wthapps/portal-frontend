import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { Constants, CHAT_ACTIONS, ChatConstant } from '@wth/shared/constant';
import { CommonEvent, CommonEventService, StorageService } from '@wth/shared/services';
import { MessageEventService } from '@chat/shared/message/message-event.service';
import { MESSAGE_DELETE } from '@chat/shared/message/message-event.constant';

declare var _: any;

const MEDIA_PATH_MAPPINGS = {
  'Media::Photo': 'photos',
  'Media::Video': 'videos'
};

@Component({
  selector: 'message-item',
  templateUrl: 'message-item.component.html',
  styleUrls: ['message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageItemComponent implements OnInit {
  @Input() message: any;
  @Input() byMe: boolean;
  @Input() prevMessage: any;
  @Input() contactItem: any;
  @Input() emojiMap: any;
  @Input() selectedConversation;
  @Output() onChat: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewProfile: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();


  readonly tooltip: any = Constants.tooltip;
  readonly noteUrl: any = Constants.baseUrls.note;
  readonly socialUrl: any = Constants.baseUrls.social;
  readonly actions = CHAT_ACTIONS;
  readonly NO_ACTION_MESSAGES = ['message_deleted', 'message_cancel', 'request', 'request_accepted'];

  private modifiedMessage: any;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private storageService: StorageService,
    private pubSubEventService: CommonEventService,
    private messageEventService: MessageEventService,
  ) { }

  ngOnInit() {
    // console.log(this.message);
  }

  preview(message: any) {
    this.messageEventService.preview({
      message: message
    });
  }

  doAction(event: CommonEvent) {
    const editingEvent = _.cloneDeep(event); // this helps current value doesn't change when users edit message

    this.pubSubEventService.broadcast(editingEvent);
  }

  copy() {
    this.messageEventService.copy({message: {
      group_id: this.message.group_id,
      message: this.message.message,
      message_type: this.message.message_type,
      content_type: this.message.content_type,
    }});
  }

  quote() {
    this.messageEventService.quote({message: this.message});
  }

  edit() {
    this.messageEventService.edit({message: this.message});
  }

  delete() {
    this.messageEventService.delete({message: this.message});
  }

  download() {
    this.messageEventService.download({message: this.message});
  }

  cancel() {
    this.doAction({
      channel: 'ConversationDetailComponent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_CANCEL,
      payload: this.message
    });
  }

  doEvent(event: any) {
    this.event.emit({
      channel: 'chatCommonEvent',
      action: event.action,
      data: this.message
    });
  }

  createChat(user: any) {
    this.onChat.emit(user);
  }

  viewProfile(user: any) {
    this.onViewProfile.emit(user);
  }

  onShareContact(data: any) {
    if (data.action === 'cancel') {
      this.delete();
    }
    if (data.action === 'resend') {
      // this.chatService.shareContact([this.message.display.share_contact.id]);
      this.chatService.selectContactByPartnerId(this.message.display.share_contact.id);
    }
  }

  cancelContactRequest(contact: any) { }


}
