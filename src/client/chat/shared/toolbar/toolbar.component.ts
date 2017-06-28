import { Component, ViewChild, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatShareEditConversationComponent } from '../modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from '../modal/add-contact.component';
import { ConfirmationService } from 'primeng/components/common/api';

declare let $: any;
declare let _: any;
declare let window: any;

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
  usersOnlineItem: any;
  profileUrl: any;
  showSendMessage: boolean = false;
  showBlacklist: boolean = false;

  constructor(private chatService: ChatService, private confirmationService: ConfirmationService) {
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
    this.chatService.addGroupUserFavorite(this.item.value);
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

  onRemoveFromConversation(user: any) {
    this.chatService.removeFromConversation(this.item.value, user.id);
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

  onSelect(user: any) {
    this.chatService.selectContactByPartnerId(user.id);
  }

  checkSendMessage(user: any) {
    let conversations: any = this.chatService.storage.find('chat_contacts').value;
    let contact: any = _.find(conversations.data, {'partner_id': user.id});
    if (contact) {
      this.showSendMessage = true;
    } else {
      this.showSendMessage = false;
    }
  }

  inContact(user: any) {
    let conversations: any = this.chatService.storage.find('chat_contacts').value;
    let contact: any = _.find(conversations.data, {'partner_id': user.id});
    if (contact) {
      return true;
    } else {
      if (this.chatService.user.profile.id == user.id) {
        return true;
      }
      return false;
    }
  }

  onAddToBlackList(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to add this contact to black list ?',
      header: 'Add To Black List',
      accept: () => {
        this.chatService.addGroupUserBlackList(user.id);
      }
    });
  }

  checkBlacklist(user: any) {
    if (this.chatService.user.profile.id == user.id) {
      this.showBlacklist = false;
    } else {
      this.showBlacklist = true;
    }
  }
}
