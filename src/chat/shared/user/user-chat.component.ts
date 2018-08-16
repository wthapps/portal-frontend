import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'w-user-chat',
  templateUrl: 'user-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserChatComponent implements OnInit {
  @Input() user: any;
  @Input() size: string = 'xs'; //xs, xsm, sm, md, lg

  constructor() {
  }

  ngOnInit() {
  }
}
