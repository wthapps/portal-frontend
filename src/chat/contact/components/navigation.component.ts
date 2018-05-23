import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ZChatShareAddContactComponent } from '../../shared/modal/add-contact.component';
import { ChatService } from '../../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-navigation',
  templateUrl: 'navigation.component.html'
})
export class ZChatContactMenuComponent implements OnInit {
  @Input() tab: any = 'all';
  @Input() count: any;
  // contactItem:any;
  constant:any;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;
  menu:any = [
    {tab: 'all', text: 'All Contacts', link: '/contacts'},
    {tab: 'online', text: 'Online', link: '/contacts/online'},
    {tab: 'receive', text: 'Received', link: '/contacts/receive'},
    {tab: 'pending', text: 'Pending', link: '/contacts/pending'},
    {tab: 'sent_request', text: 'Requested', link: '/contacts/sent_request'},
    {tab: 'blacklist', text: 'Blacklist', link: '/contacts/blacklist'}
  ];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    // this.contactItem = this.chatService.storage.find("chat_conversations");
    this.constant = this.chatService.constant;
  }

  newContact() {
    this.addContact.type = 'addContact';
    this.addContact.open();
  }
}