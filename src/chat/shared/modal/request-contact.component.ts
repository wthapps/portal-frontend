import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { BsModalComponent } from 'ng2-bs3-modal';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-request-contact',
  templateUrl: 'request-contact.component.html'
})

export class ZChatShareRequestContactComponent {

  contact: any;
  message: string = 'Hello, please accept my request';
  @ViewChild('modal') modal: BsModalComponent;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  constructor(private chatService: ChatService) {

  }

  send() {
    this.chatService.chatContactService.addContact([this.contact.id], this.message);
    this.modal.close();
    this.onClose.emit();
  }
}