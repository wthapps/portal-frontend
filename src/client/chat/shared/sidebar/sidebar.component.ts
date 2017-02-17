import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})

export class ZChatSidebarComponent implements OnInit {
  item:any;
  usersOnlineItem:any;
  favouriteContacts:any;
  recentContacts:any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.handler.addListener('on_default_contact_select_side_bar', 'on_default_contact_select', (contact:any) => {
      this.chatService.router.navigate([`${this.chatService.constant.conversation_url}/${contact.id}`]);
      this.chatService.getMessages(contact.group_json.id);
      this.chatService.chanel.subscribe(contact.group_json.id);
    });
    this.item = this.chatService.getContacts();
    this.recentContacts = this.chatService.getRecentContacts();
    this.favouriteContacts = this.chatService.getFavouriteContacts();
    this.usersOnlineItem = this.chatService.getUsersOnline();
  }

  onSelect(contact:any) {
    $('#chat-message-text').focus();
    this.chatService.selectContact(contact);
  }
}
