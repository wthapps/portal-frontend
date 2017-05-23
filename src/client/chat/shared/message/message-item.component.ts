import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Config } from '../../../core/shared/config/env.config';
import { PubSubEventService } from '../../../core/shared/services/pub-sub/pub-sub-event.service';
import { PubSubEvent } from '../../../core/shared/services/pub-sub/pub-sub-event';
import { CHAT_ACTIONS } from '../constants/chat-constant';


@Component({
  moduleId: module.id,
  selector: 'message-item',
  templateUrl: 'message-item.component.html',
  styleUrls:['message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: any;
  @Input() prevMessage: any = null;
  @Output() onAddContact: EventEmitter<any> = new EventEmitter<any>();

  actions = CHAT_ACTIONS;

  constructor(
    private chatService: ChatService,
    private pubSubEventService: PubSubEventService) {

  }


  ngOnInit() {
    // ByMe
    if (this.message.display && this.message.display.id) {
      this.message.byMe = this.chatService.user.profile.id == this.message.display.id;
    } else {
      this.message.file_json = {};
      this.message.file_json.thumbnail_url = Config.RES + '/portal-frontend/common-images/file/file_upload/filethumb.png';
    }

  }

  doAction(event: PubSubEvent) {
    this.pubSubEventService.addEvent(event);
  }



  onAdd(contact:any) {
    this.onAddContact.emit(contact);
  }

  hasShowOwner(): boolean {
    if(this.prevMessage == null) {
      return true;
    }
    else if (this.message.display.id === this.prevMessage.display.id) {
      return false;
    }
    return true;
  }

  hasShowDate(): boolean {

    if(this.prevMessage == null) {
      return true;
    }
    else if (this.message.created_at.slice(0,10) === this.prevMessage.created_at.slice(0,10)) {
      return false;
    }
    return true;
  }
}
