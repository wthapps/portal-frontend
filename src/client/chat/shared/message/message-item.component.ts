import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Config } from '../../../core/shared/config/env.config';
import { PubSubEventService } from '../../../core/shared/services/pub-sub/pub-sub-event.service';
import { PubSubEvent } from '../../../core/shared/services/pub-sub/pub-sub-event';
import { CHAT_ACTIONS } from '../constants/chat-constant';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'message-item',
  templateUrl: 'message-item.component.html',
  styleUrls: ['message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: any;
  @Input() prevMessage: any = null;
  @Output() onAddContact: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();


  actions = CHAT_ACTIONS;

  profileUrl: any = '';

  private modifiedMessage: any;

  constructor(
    private chatService: ChatService,
    private pubSubEventService: PubSubEventService) {
    this.profileUrl = this.chatService.constant.profileUrl;
  }

  ngOnInit() {
    // ByMe
    if (this.message.display && this.message.display.id) {
      this.message.byMe = this.chatService.user.profile.id == this.message.display.id;
    } else {
      this.message.file_json = {};
      this.message.file_json.thumbnail_url = Config.RES + '/portal-frontend/common-images/file/file_upload/filethumb.png';
    }


    console.log('message:::::::::::', this.message);

  }

  doAction(event: PubSubEvent) {
    var editingEvent = _.cloneDeep(event); // this helps current value doesn't change when users edit message

    this.pubSubEventService.addEvent(editingEvent);
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
    this.event.emit(event);
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
    if (this.message.display.id === this.prevMessage.display.id) {
      return false;
    }
    return true;
  }

  hasShowDate(): boolean {

    if (this.prevMessage == null) {
      return true;
    }
    if (this.message.created_at.slice(0, 10) === this.prevMessage.created_at.slice(0, 10)) {
      return false;
    }
    return true;
  }
}
