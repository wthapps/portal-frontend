import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';

declare var _: any;
@Component({
  moduleId: module.id,
  selector: 'z-chat-share-list',
  templateUrl: 'list.component.html'
})
export class ZChatShareListComponent implements OnInit {
  item: any;
  contactItem: any;
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.item = this.chatService.getCurrentMessages();
    this.contactItem = this.chatService.getContactSelect();
    // this.chatService.subscribeChanel();
  }

  onLoadMore() {
    this.chatService.loadMoreMessages();
  }

  onAddContact(contact:any) {
    console.log(contact);
    this.requestModal.contact = contact;
    this.requestModal.modal.open();
  }
}
