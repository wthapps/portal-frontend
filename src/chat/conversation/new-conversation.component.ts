import { Component, ViewChild } from '@angular/core';
import { ZChatToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-new-conversation',
  templateUrl: 'new-conversation.component.html'
})
export class ZChatNewConversationComponent {
  @ViewChild('chatToolbar') chatToolbar: ZChatToolbarComponent;

  onAddContact() {
    this.chatToolbar.onAddContact();
  }

  onEditConversation() {
    this.chatToolbar.onEditConversation();
  }

}
