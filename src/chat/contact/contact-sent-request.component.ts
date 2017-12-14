import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ApiBaseService } from '@wth/shared/services';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-sent-request',
  templateUrl: 'contact-sent-request.component.html'
})
export class ZChatContactSentRequestComponent implements OnInit {
  contactItem: any;
  count: any;

  constructor(private chatService: ChatService, private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {
    this.contactItem = this.chatService.getConversations();
    this.apiBaseService.post('zone/chat/contact/contact_tab_count').subscribe((res: any) => {
      this.count = res.data;
    });
  }

  onResend(contact:any) {
    this.chatService.chatContactService.addContact([contact.display.id]);
  }

  onCancel(contact:any) {
    this.chatService.chatContactService.cancelContactRequest(contact);
  }
}
