import { Component, OnInit, ViewChild } from '@angular/core';
import { ZChatToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-new-conversation',
  templateUrl: 'new-conversation.component.html'
})
export class ZChatNewConversationComponent implements OnInit {
  @ViewChild('chatToolbar') chatToolbar: ZChatToolbarComponent;

  constructor() {
  }

  ngOnInit() {
  }

  onAddContact() {
    this.chatToolbar.onAddContact();
  }

  onEditConversation() {
    this.chatToolbar.onEditConversation();
  }

}
