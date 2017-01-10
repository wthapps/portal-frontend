import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ZChatShareEditConversationComponent } from '../modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from '../modal/add-contact.component';
import { ChatService } from '../services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-toolbar',
  templateUrl: 'toolbar.component.html'
})

export class ZChatToolbarComponent implements OnInit {
  @ViewChild('editConversation') editConversation: ZChatShareEditConversationComponent;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;
  contact: any;

  constructor(private chatService: ChatService) {

  }

  ngOnInit() {
    this.chatService.onContactSelect((contact:any) => {
      this.contact = contact;
    });
    this.contact = this.chatService.getContactSelect();
  }

  onAddContact() {
    this.addContact.modal.open();
  }

  onEditConversation() {
    this.editConversation.modal.open();
  }
}
