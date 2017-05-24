import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ZChatShareRequestContactComponent } from '../shared/modal/request-contact.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-receive',
  templateUrl: 'contact-receive.component.html'
})
export class ZChatContactReceiveComponent implements OnInit {
  users:any;
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.apiBaseService.post('zone/chat/contact/get_share_contacts').subscribe((res:any) => {
      this.users = res.data;
    });
  }

  onAddToContact(contact:any) {
    this.requestModal.contact = contact;
    this.requestModal.modal.open();
  }
}
