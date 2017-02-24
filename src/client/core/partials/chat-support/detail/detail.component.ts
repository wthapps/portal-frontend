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
  selector: 'wth-chat-support-detail',
  templateUrl: 'detail.component.html',
  animations: [
    trigger('chatState', [
      state('active', style({opacity: 1, transform: 'translateX(0)'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition('* => void', [
        animate('0.2s 10 ease-out', style({
          opacity: 0,
          transform: 'translateY(100%)'
        }))
      ])
    ])
  ]
})
export class CoreChatSupportDetailComponent implements OnInit {
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
