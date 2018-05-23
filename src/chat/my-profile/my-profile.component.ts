import { Component, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'z-chat-my-profile',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['my-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZChatMyProfileComponent {}
