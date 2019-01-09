import { Component, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ChatConversationService } from '../services/chat-conversation.service';
import { ChatMessageService } from '../services/chat-message.service';
import { takeUntil, take } from 'rxjs/operators';


@Component({
  selector: 'z-chat-share-item-request',
  templateUrl: 'item-request.component.html'
})
export class ZChatShareItemRequestComponent {
  @Input() message: any;

  constructor(
    private chatService: ChatService,
    private chatConversationService: ChatConversationService,
    private chatMessageService: ChatMessageService) {
  }

  onAccept() {
    this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(contact => {
      this.chatConversationService.acceptRequest(contact).then(res => {
        this.chatMessageService.getMessages(contact.group_id)
      });
    })
  }

  onDecline() {
    this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(contact => {
      this.chatConversationService.declineRequest(contact)
    })
  }
}
