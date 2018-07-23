import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChatService } from '../services/chat.service';

@Component({
  selector: 'z-chat-share-user-icon',
  templateUrl: 'user-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZChatShareUserIconComponent implements OnInit {
  @Input() image: any;
  @Input() name: any;
  @Input() groupType: any;
  @Input() userId: any;
  @Input() size: string = 'xs'; //xs, xsm, sm, md, lg
  usersOnlineItem$: Observable<any>;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
  }
}
