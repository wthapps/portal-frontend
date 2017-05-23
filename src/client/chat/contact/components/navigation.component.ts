import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ZChatShareAddContactComponent } from '../../shared/modal/add-contact.component';
import { ChatService } from '../../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-navigation',
  templateUrl: 'navigation.component.html'
})
export class ZChatContactMenuComponent implements OnInit {
  @Input() tab:any = "all";
  contactItem:any;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;
  menu:any = [
    {tab: "all", text: "ALL", link: '/contacts'},
    {tab: "online", text: "ONLINE", link: '/contacts/online'},
    {tab: "blacklist", text: "BLACKLIST", link: '/contacts/blacklist'},
    {tab: "sent_request", text: "SENT REQUEST", link: '/contacts/sent_request'},
    {tab: "pending", text: "PENDING", link: '/contacts/pending'},
  ];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.contactItem = this.chatService.getContacts();
  }

  newContact() {
    this.addContact.type = 'addContact';
    this.addContact.modal.open();
  }
}
