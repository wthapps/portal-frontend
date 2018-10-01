import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'z-chat-share-user',
  templateUrl: 'user.component.html'
})
export class ZChatShareUserComponent implements OnInit {
  @Input() data: any;
  @Input() size = 'xs'; // xs, xsm, sm, md, lg
  @Input() displayUserName = true;
  @Input() usersOnlineItem: any;
  @Input() isStranger = false;
  @Input() displayAvatar = true;

  constructor() {
  }

  ngOnInit() {
  }
}
