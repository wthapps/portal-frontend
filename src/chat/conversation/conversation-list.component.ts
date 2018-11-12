import { Component, OnInit } from '@angular/core';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { UserService } from '@shared/services';
import { ChatService } from '../shared/services/chat.service';

@Component({
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent implements OnInit {
  selectContact: any;
  conversations: any;

  constructor(
    public userService: UserService,
    private chatService: ChatService,
    private addContactService: ZChatShareAddContactService
  ) {
  }

  ngOnInit() {
    this.selectContact = this.chatService.getContactSelect();
    if (this.selectContact && this.selectContact.value) {
      this.chatService.router.navigate([
        `${this.chatService.constant.conversationUrl}/${
          this.selectContact.value.id
          }`
      ]);
    }

    this.chatService.getConversationsAsync().subscribe((res: any) => {
      this.conversations = res.value.data;
    });
  }

  onAddContact() {
    this.addContactService.open('addContact');
  }
}
