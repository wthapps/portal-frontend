import { Component, OnInit} from '@angular/core';
import { ChatService } from './shared/services/chat.service';

/**
 * This class represents the lazy loaded ZChatComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'z-chat',
  templateUrl: 'chat.component.html'
})
export class ZChatComponent implements OnInit{
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.subscribeNotification();
  }
}
