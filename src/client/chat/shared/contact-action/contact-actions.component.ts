import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatShareAddToConversationComponent } from '../modal/add-to-conversation.component';

declare let $:any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-actions',
  templateUrl: 'contact-actions.component.html'
})
export class ZChatContactActionsComponent implements OnInit {
  @Input() contact:any;
  conversationUrl:any;
  @ViewChild('addConversation') addConversation: ZChatShareAddToConversationComponent;
  // Config component
  @Input() config:any = {
    history: false
  };

  constructor(private chatService: ChatService) {
    this.conversationUrl = this.chatService.constant.conversationUrl
  }

  ngOnInit() {
  //   console.log(this.config)
  }

  onSelect(contact:any) {
    if(this.config.history) {
      this.chatService.updateHistory(contact);
    }
    $('#chat-message-text').focus();
    this.chatService.selectContact(contact);
  }

  addToConversation() {
    this.addConversation.modal.open();
  }

  addBlackList() {
    // console.log(this.contact);
    this.chatService.addGroupUserBlackList(this.contact);
  }

  disableNotification() {
    this.chatService.updateNotification(this.contact, {notification: false});
  }

  enableNotification() {
    this.chatService.updateNotification(this.contact, {notification: true});
  }

  deleteContact() {
    this.chatService.deleteContact(this.contact);
  }
}
