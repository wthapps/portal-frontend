import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { Config } from '../../../core/shared/config/env.config';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { CommonEvent } from '../../../core/shared/services/common-event/common-event';
import { CHAT_ACTIONS } from '../../../core/shared/constant/chat-constant';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'message-item',
  templateUrl: 'message-item.component.html',
  styleUrls: ['message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: any;
  @Input() prevMessage: any;
  @Input() contactItem: any;
  @Output() onAddContact: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();


  actions = CHAT_ACTIONS;

  profileUrl: any = '';

  private modifiedMessage: any;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private pubSubEventService: CommonEventService) {
    this.profileUrl = this.chatService.constant.profileUrl;
  }

  ngOnInit() {
    this.contactItem = this.chatService.getContactSelect();
    // ByMe
    if (this.message.display && this.message.display.id) {
      this.message.byMe = this.chatService.user.profile.id == this.message.display.id;
    } else {
      this.message.file_json = {};
      this.message.file_json.thumbnail_url = Config.RES + '/portal-frontend/common-images/file/file_upload/filethumb.png';
    }

  }

  doAction(event: CommonEvent) {
    var editingEvent = _.cloneDeep(event); // this helps current value doesn't change when users edit message

    this.pubSubEventService.broadcast(editingEvent);
  }

  copy() {
    this.doAction({action: CHAT_ACTIONS.CHAT_MESSAGE_COPY, payload: this.message});
  }

  quote() {
    this.doAction({action: CHAT_ACTIONS.CHAT_MESSAGE_QUOTE, payload: this.message});
  }

  edit() {
    this.doAction({action: CHAT_ACTIONS.CHAT_MESSAGE_EDIT, payload: this.message});
  }

  delete() {
    this.doAction({action: CHAT_ACTIONS.CHAT_MESSAGE_DELETE, payload: this.message});
  }

  download() {
    this.doAction({action: CHAT_ACTIONS.CHAT_MESSAGE_DOWNLOAD, payload: this.message});
  }

  doEvent(event: any) {
    this.event.emit({action: event.action, data: this.message});
  }

  onAdd(contact: any) {
    this.onAddContact.emit(contact);
  }

  cancelContact(contact: any) {

  }

  hasShowOwner(): boolean {
    if (this.prevMessage == null) {
      return true;
    }
    if (this.message.display && this.prevMessage.display && this.message.display.id === this.prevMessage.display.id) {
      return false;
    }
    return true;
  }

  hasShowDate(): boolean {

    if (this.prevMessage == null) {
      return true;
    }
    if (this.message.created_at && this.prevMessage.created_at && this.message.created_at.slice(0, 10) === this.prevMessage.created_at.slice(0, 10)) {
      return false;
    }
    return true;
  }
}
