import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-item',
  templateUrl: 'item.component.html'
})
export class ZChatShareItemComponent implements OnInit{
  @Input() message: any;
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // ByMe
    this.message.byMe = this.chatService.user.profile.id == this.message.display.id
  }
}
