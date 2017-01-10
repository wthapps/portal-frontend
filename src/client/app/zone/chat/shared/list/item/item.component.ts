import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-item',
  templateUrl: 'item.component.html'
})
export class ZChatShareItemComponent {
  @Input() message: any;
}
