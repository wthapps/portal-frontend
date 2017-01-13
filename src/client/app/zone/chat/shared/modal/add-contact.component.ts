import { Component, ViewChild } from '@angular/core';

import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-add-contact',
  templateUrl: 'add-contact.component.html'
})
export class ZChatShareAddContactComponent {
  @ViewChild('modal') modal: HdModalComponent;
}
