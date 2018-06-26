import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ZChatShareAddContactComponent } from '../shared/modal/add-contact.component';
import { ApiBaseService } from '@wth/shared/services';
import { CHAT_CONVERSATIONS } from '@wth/shared/constant';

@Component({
  selector: 'z-chat-contact',
  templateUrl: 'contact.component.html'
})
export class ZChatContactComponent implements OnInit {
  contactItem: any;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;
  count: any;

  constructor(
    private chatService: ChatService,
    public apiBaseService: ApiBaseService
  ) {}

  ngOnInit() {
    this.contactItem = this.chatService.storage.find(CHAT_CONVERSATIONS);
    this.apiBaseService
      .post('zone/chat/contact/contact_tab_count')
      .subscribe((res: any) => {
        this.count = res.data;
      });
  }

  newContact() {
    this.addContact.type = 'addContact';
    this.addContact.open();
  }
}
