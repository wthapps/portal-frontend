import { Component } from '@angular/core';

import { UserService } from '@shared/services';
import { ContactSelectionService } from './../shared/selections/contact/contact-selection.service';

@Component({
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent {
  constructor(public userService: UserService, private contactSelectionService: ContactSelectionService) { }

  createChat() {
    this.contactSelectionService.open({
      type: 'NEW_CHAT'
    });
  }
}
