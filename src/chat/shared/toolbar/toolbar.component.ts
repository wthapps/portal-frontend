import { Component, ViewChild, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChatService } from '../services/chat.service';
import { ZChatShareEditConversationComponent } from '../modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from '../modal/add-contact.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { CommonEventService, UserService } from '@shared/services';


declare let $: any;
declare let _: any;
declare let window: any;

@Component({
  selector: 'z-chat-share-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})

export class ZChatToolbarComponent implements OnInit {
  @ViewChild('editConversation') editConversation: ZChatShareEditConversationComponent;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;
  @Input() contactSelect: any;
  @Input() chatContactList: {[partner_id: string]: any} = {};
  showMemberBar: boolean = false;
  usersOnlineItem$: Observable<any>;
  profileUrl: any;
  showSendMessage: boolean = false;
  showBlacklist: boolean = false;

  readonly tooltip: any = Constants.tooltip;

  constructor(private chatService: ChatService,
              private commonEventService: CommonEventService,
              private userService: UserService,
              private wthConfirmService: WthConfirmService) {
    this.profileUrl = this.chatService.constant.profileUrl;
  }

  ngOnInit() {
    // this.item = this.chatService.getContactSelect();
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
  }

  onAddContact() {
    this.addContact.type = 'addContact';
    this.addContact.open();
  }

  onEditConversation() {
    this.editConversation.conversation = this.chatService.getContactSelect().value;
    this.editConversation.modal.open();
  }

  onAddMember() {
    this.addContact.type = 'addMember';
    this.addContact.open();
  }

  onFavorite() {
    this.chatService.addGroupUserFavorite(this.contactSelect);
  }

  disableNotification() {
    this.chatService.updateNotification(this.contactSelect, {notification: false});
  }

  enableNotification() {
    this.chatService.updateNotification(this.contactSelect, {notification: true});
  }

  sendContact() {
    this.addContact.type = 'shareContact';
    this.addContact.open();
  }

  leaveConversation() {
    this.chatService.leaveConversation(this.contactSelect);
  }

  onRemoveFromConversation(user: any) {
    this.chatService.removeFromConversation(this.contactSelect, user.id);
  }

  onShowMemberBar() {
    this.showMemberBar = !this.showMemberBar;
  }

  showDropdownMenu(e: any) {
    let showDropdownMenu_ul = e.target.nextElementSibling;
    if (e.screenX + 240 > window.innerWidth) {
      showDropdownMenu_ul.style.left = 'auto';
    }
  }

  onDeleteConversation() {
    this.wthConfirmService.confirm({
      acceptLabel: 'Delete',
      message: 'Are you sure you want to delete this conversation ?',
      header: 'Delete Conversation',
      accept: () => {
        this.chatService.deleteContact(this.contactSelect);
      }
    });
  }

  onSelect(user: any) {
    this.chatService.selectContactByPartnerId(user.id);
  }

  checkSendMessage(user: any) {
    this.showSendMessage = !!this.chatContactList[user.id] && this.userService.getSyncProfile().id !== user.id;
  }

  onAddToBlackList(user: any) {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to add this contact to black list ?',
      header: 'Add To Black List',
      accept: () => {
        this.chatService.addGroupUserBlackList(user.id);
      }
    });
  }

  checkBlacklist(user: any) {
    if (this.chatService.userService.getSyncProfile().id == user.id) {
      this.showBlacklist = false;
    } else {
      this.showBlacklist = true;
    }
  }
}
