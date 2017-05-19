import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Config } from '../../../../core/shared/config/env.config';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-item',
  templateUrl: 'item.component.html'
})
export class ZChatShareItemComponent implements OnInit {
  @Input() message: any;
  @Output() onAddContact: EventEmitter<any> = new EventEmitter<any>();
  constructor(private chatService: ChatService) {};


  ngOnInit() {
    // ByMe
    if (this.message.display && this.message.display.id) {
      this.message.byMe = this.chatService.user.profile.id == this.message.display.id;
    } else {
      this.message.file_json = {};
      this.message.file_json.thumbnail_url = Config.RES + '/portal-frontend/common-images/file/file_upload/filethumb.png';
    }
  }

  onAdd(contact:any) {
    this.onAddContact.emit(contact);
  }
}
