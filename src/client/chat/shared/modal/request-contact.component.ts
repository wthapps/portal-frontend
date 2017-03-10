import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-request-contact',
  templateUrl: 'request-contact.component.html'
})

export class ZChatShareRequestContactComponent implements OnInit {

  contact: any;
  message: string = "Hello, please accept my request";
  @ViewChild('modal') modal: ModalComponent;

  constructor(private chatService: ChatService) {

  }

  ngOnInit() {

  }

  send() {
    this.chatService.addContact([this.contact.id], this.message);
    this.modal.close();
  }
}
