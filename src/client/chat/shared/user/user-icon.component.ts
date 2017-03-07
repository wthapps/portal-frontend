import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-user-list',
  templateUrl: 'user-icon.component.html'
})
export class ZChatShareUserIconComponent implements OnInit{
  @Input() image:any;
  @Input() groupType:any;
  @Input() userId:any;
  usersOnlineItem:any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.usersOnlineItem = this.chatService.getUsersOnline();
  }
}
