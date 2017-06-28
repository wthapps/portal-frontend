import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';


@Component({
  moduleId: module.id,
  selector: 'z-chat-share-item-request',
  templateUrl: 'item-request.component.html'
})
export class ZChatShareItemRequestComponent implements OnInit {
  @Input() message: any;

  constructor(private chatService: ChatService) {};

  ngOnInit() {

  }

  onAccept() {
    let contact = this.chatService.getContactSelect().value;
    this.chatService.acceptRequest(contact);
  }

  onDecline() {
    let contact = this.chatService.getContactSelect().value;
    this.chatService.declineRequest(contact);
  }
}
