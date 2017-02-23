import {
  Component, OnInit,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support',
  templateUrl: 'chat-support.component.html',
  styleUrls: ['chat-support.component.css'],
  animations: [
    trigger('chatState', [
      state('active', style({opacity: 1, transform: 'translateX(0)'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition('* => void', [
        animate('0.2s 10 ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ])
  ]
})
export class CoreChatSupportComponent implements OnInit {
  showChat: boolean = false;
  chatState: string = 'inactive';

  constructor() {
  }

  ngOnInit() {
  }

  onShow() {
    this.showChat = !this.showChat;
    this.chatState = (this.chatState == 'inactive' ? 'active' : 'inactive');
  }
}
