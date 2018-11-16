import { Component, OnInit } from '@angular/core';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { UserService } from '@shared/services';
import { ChatService } from '../shared/services/chat.service';

@Component({
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent implements OnInit {
  conversations: any;

  constructor(
    public userService: UserService,
    private chatService: ChatService,
    private addContactService: ZChatShareAddContactService
  ) {
  }

  ngOnInit() {
    this.chatService.getConversationsAsync().subscribe((res: any) => {
      this.conversations = res.value.data;
      if (this.conversations && this.conversations.length > 0) {
        this.chatService.router.navigate([
          `${this.chatService.constant.conversationUrl}/${
            this.conversations[0].group_id
            }`
        ]);
      }
    });
  }

  onAddContact() {
    this.addContactService.open('addContact');
  }
}
