import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-pending',
  templateUrl: 'contact-pending.component.html'
})
export class ZChatContactPendingComponent implements OnInit {
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

  onAccept(contact:any) {
    this.chatService.acceptRequest(contact);
  }

  onDecline(contact:any) {
    this.chatService.declineRequest(contact, false);
  }
}
