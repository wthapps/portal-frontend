import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ZChatShareRequestContactComponent } from '../shared/modal/request-contact.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-search',
  templateUrl: 'contact-search.component.html',
  styleUrls: ['contact-search.component.css']
})
export class ZChatContactSearchComponent implements OnInit {
  contactItem:any;
  name:any;
  newContacts:any;
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.contactItem = this.chatService.getContacts();
  }

  search() {
    this.chatService.searchUsers(this.name).subscribe(
      (res:any) => {
        this.newContacts = res.data;
      }
    );
  }

  onRequest(contact:any) {
    console.log(contact);
    this.requestModal.contact = contact;
    this.requestModal.modal.open();
  }
}
