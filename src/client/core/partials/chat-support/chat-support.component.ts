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
      state('active', style({opacity: 1, transform: 'translateY(0)'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(20%)'
        }),
        animate('0.3s ease-in')
      ]),
      transition('* => void', [
        animate('0.3s 10 ease-out', style({
          opacity: 0,
          transform: 'translateY(20%)'
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
