import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'z-chat-share-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss']
})
export class ZChatShareUserComponent implements OnInit {
  @Input() data: any;
  @Input() size: string = 'xs'; //xs, xsm, sm, md, lg
  @Input() displayUserName: boolean = true;
  usersOnlineItem$: Observable<any>;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
  }
}
