import { Component, ViewChild, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatShareEditConversationComponent } from '../modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from '../modal/add-contact.component';

declare var $: any;
declare var window: any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})

export class ZChatToolbarComponent implements OnInit {
  @ViewChild('editConversation') editConversation: ZChatShareEditConversationComponent;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;
  item: any;
  showMemberBar: boolean = false;
  usersOnlineItem:any;
  profileUrl:any;

  constructor(private chatService: ChatService) {
    this.profileUrl = this.chatService.constant.profileUrl;
  }

  ngOnInit() {
    this.item = this.chatService.getContactSelect();
    this.usersOnlineItem = this.chatService.getUsersOnline();
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

  sendContact() {
    this.addContact.type = 'shareContact';
    this.addContact.modal.open();
  }

  leaveConversation() {
    this.chatService.leaveConversation(this.item.value);
  }

  onShowMemberBar() {
    this.showMemberBar = !this.showMemberBar;
  }

  showDropdownMenu(e: any) {
    let showDropdownMenu_ul = e.target.nextElementSibling;
    if (e.screenX + 240 > window.innerWidth) {
      showDropdownMenu_ul.style.right = 0;
      showDropdownMenu_ul.style.left = 'auto';
    }
  }

  onDeleteConversation() {
    this.chatService.deleteContact(this.item.value);
  }

  onSelect(contact:any) {
    console.log(contact);
    this.chatService.selectContact(contact);
  }
}
