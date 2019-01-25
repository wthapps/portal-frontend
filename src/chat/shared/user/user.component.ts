import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'z-chat-share-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZChatShareUserComponent implements OnInit {
  @Input() data: any;
  @Input() size = 'xs'; // xs, xsm, sm, md, lg
  @Input() displayUserName = true;
  @Input() displayAvatar: Boolean = true;
  @Input() usersOnlineItem: any;
  @Input() isPending = false;

  constructor() {}

  ngOnInit() {}
}
