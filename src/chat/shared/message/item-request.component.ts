import { Component, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'z-chat-share-item-request',
  templateUrl: 'item-request.component.html'
})
export class ZChatShareItemRequestComponent {
  @Input() message: any;

  constructor(private chatService: ChatService) {
  }

  onAccept() {
    const contact = this.chatService.getContactSelect().value;
    this.chatService.acceptRequest(contact);
  }

  onDecline() {
    const contact = this.chatService.getContactSelect().value;
    this.chatService.declineRequest(contact);
  }
}
