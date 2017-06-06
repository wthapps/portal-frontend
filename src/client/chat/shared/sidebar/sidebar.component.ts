import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatToolbarComponent } from '../toolbar/toolbar.component';
import { NavigationEnd, Router } from '@angular/router';

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
  historyContacts:any;
  recentContacts:any;
  historyShow:any = true;
  isRedirect:boolean;
  @ViewChild('chatToolbar') chatToolbar: ZChatToolbarComponent;

  constructor(public chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        // URL "/" and "/conversations"
        if (event.url.indexOf('conversations') !== -1 || event.url.length == 1) {
          this.isRedirect = true;
        } else {
          this.isRedirect = false;
        }
      });
    this.chatService.handler.addListener('on_default_contact_select_side_bar', 'on_default_contact_select', (contact:any) => {
      if (this.isRedirect) {
        this.chatService.router.navigate([`${this.chatService.constant.conversationUrl}/${contact.id}`]);
        this.chatService.getMessages(contact.group_json.id);
      }
    });
    this.item = this.chatService.getContacts();
    this.recentContacts = this.chatService.getRecentContacts();
    this.favouriteContacts = this.chatService.getFavouriteContacts();
    this.historyContacts = this.chatService.getHistoryContacts();
    this.usersOnlineItem = this.chatService.getUsersOnline();
  }

  onSelect(contact:any) {
    $('#chat-message-text').focus();
    this.chatService.selectContact(contact);
  }

  onAddContact() {
    this.chatToolbar.onAddContact();
  }

  historyToggle() {
    this.historyShow = !this.historyShow;
  }
}
