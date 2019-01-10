import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'z-chat-share-user-avatar',
  templateUrl: 'user-avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZChatShareUserAvatarComponent implements OnInit {
  @Input() data: any;
  @Input() size: String = 'xs'; // xs, xsm, sm, md, lg
  @Input() displayUserName: Boolean = true;
  @Input() isPending = false;
  @Input() usersOnlineItem: any;

  constructor() {}

  ngOnInit() {
    // console.log(this.data);
  }
}
