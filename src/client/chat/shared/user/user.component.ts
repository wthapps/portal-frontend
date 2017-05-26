import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css']
})
export class ZChatShareUserComponent implements OnInit {
  @Input() data: any;
  @Input() size: string = 'xs'; //xs, xsm, sm, md, lg
  usersOnlineItem: any;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.usersOnlineItem = this.chatService.getUsersOnline();
  }
}
