import { Component, ViewChild } from '@angular/core';
import { ZChatShareEditConversationComponent } from '../form/edit-conversation.component';
import { ZChatShareAddContactComponent } from '../form/add-contact.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-toolbar',
  templateUrl: 'toolbar.component.html'
})

export class ZChatToolbarComponent {
  @ViewChild('editConversation') editConversation: ZChatShareEditConversationComponent;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;

  constructor() {
  }

  onAddContact() {
    this.addContact.modal.open();
  }
  onEditConversation() {
    this.editConversation.modal.open();
  }
}
