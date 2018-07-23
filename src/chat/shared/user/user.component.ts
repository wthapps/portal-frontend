import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'z-chat-share-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZChatShareUserComponent implements OnInit {
  @Input() data: any;
  @Input() size: string = 'xs'; //xs, xsm, sm, md, lg
  @Input() displayUserName: boolean = true;
  @Input() usersOnlineItem: any;

  constructor() {
  }

  ngOnInit() {
  }
}
