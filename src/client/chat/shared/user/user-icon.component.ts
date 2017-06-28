import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-user-icon',
  templateUrl: 'user-icon.component.html',
  styleUrls: ['user.component.css']
})
export class ZChatShareUserIconComponent implements OnInit {
  @Input() image: any;
  @Input() name: any;
  @Input() groupType: any;
  @Input() userId: any;
  @Input() size: string = 'xs'; //xs, xsm, sm, md, lg
  usersOnlineItem: any;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.usersOnlineItem = this.chatService.getUsersOnline();
  }
}
