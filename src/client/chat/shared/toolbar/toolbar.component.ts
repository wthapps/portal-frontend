import { Component, ViewChild, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatShareEditConversationComponent } from '../modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from '../modal/add-contact.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-toolbar',
  templateUrl: 'toolbar.component.html'
})

export class ZChatToolbarComponent implements OnInit {
  @ViewChild('editConversation') editConversation: ZChatShareEditConversationComponent;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;
  item: any;

  constructor(private chatService: ChatService) {

  }

  ngOnInit() {
    this.item = this.chatService.getContactSelect();
  }

  onAddContact() {
    this.addContact.type = 'addContact';
    this.addContact.modal.open();
  }

  onEditConversation() {
    this.editConversation.modal.open();
  }

  onAddMember() {
    this.addContact.type = 'addMember';
    this.addContact.modal.open();
  }
  onFavorite() {
    this.chatService.addGroupUserFavorite();
  }

  disableNotification() {
    this.chatService.updateNotification(this.item.value, {notification: false});
  }

  enableNotification() {
    this.chatService.updateNotification(this.item.value, {notification: true});
  }
}
