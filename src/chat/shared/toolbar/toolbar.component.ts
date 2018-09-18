import { Component, ViewChild, OnInit, Input, Renderer2, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChatService } from '../services/chat.service';
import { ZChatShareEditConversationComponent } from '../modal/edit-conversation.component';
import { ZChatShareAddContactComponent } from '../modal/add-contact.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { CommonEventService, UserService } from '@shared/services';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { merge, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


declare let $: any;
declare let _: any;
declare let window: any;

@Component({
  selector: 'z-chat-share-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})

export class ZChatToolbarComponent implements OnInit, OnDestroy {
  @ViewChild('editConversation') editConversation: ZChatShareEditConversationComponent;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;
  @Input() contactSelect: any;
  @Input() chatContactList: { [partner_id: string]: any } = {};
  showMemberBar = false;
  usersOnlineItem$: Observable<any>;
  profileUrl: any;
  showSendMessage = false;
  showBlacklist = false;

  openAssets: boolean;

  readonly tooltip: any = Constants.tooltip;

  constructor(private chatService: ChatService,
              private commonEventService: CommonEventService,
              private userService: UserService,
              private wthConfirmService: WthConfirmService,
              private addContactService: ZChatShareAddContactService,
              private renderer: Renderer2,
              private messageAssetsService: MessageAssetsService) {
    this.profileUrl = this.chatService.constant.profileUrl;

    const close$: Observable<any> = Observable.merge(
      componentDestroyed(this)
    );

    this.messageAssetsService.open$
      .pipe(takeUntil(close$))
      .subscribe(
        (res: any) => {
          this.openAssets = res;
          if (!res) {
            this.renderer.removeClass(document.body, 'open-chat-message-assets');
          } else {
            this.renderer.addClass(document.body, 'open-chat-message-assets');
          }
        });
  }

  ngOnInit() {
    // this.item = this.chatService.getContactSelect();
    this.usersOnlineItem$ = this.chatService.getUsersOnline();

  }

  ngOnDestroy() {
  }

  onAddContact() {
    this.addContactService.open('addContact');
  }

  onAddMember() {
    this.addContactService.open('addMember');
  }

  sendContact() {
    this.addContactService.open('shareContact');
  }

  onEditConversation() {
    this.editConversation.conversation = this.chatService.getContactSelect().value;
    this.editConversation.open();
  }

  onFavorite() {
    this.chatService.addGroupUserFavorite(this.contactSelect);
  }

  disableNotification() {
    this.chatService.updateNotification(this.contactSelect, { notification: false });
  }

  enableNotification() {
    this.chatService.updateNotification(this.contactSelect, { notification: true });
  }

  leaveConversation() {
    this.chatService.leaveConversation(this.contactSelect);
  }

  onDeleteConversation() {
    this.wthConfirmService.confirm({
      acceptLabel: 'Hide',
      message: 'Are you sure you want to hide this conversation?',
      header: 'Hide Conversation',
      accept: () => {
        this.chatService.deleteContact(this.contactSelect);
      }
    });
  }

  onSelect(user: any) {
    this.chatService.selectContactByPartnerId(user.id);
  }

  onShowAssets() {
    if (this.openAssets) {
      this.messageAssetsService.close();
    } else {
      this.messageAssetsService.open();
    }
  }

  /*onRemoveFromConversation(user: any) {
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

  checkBlacklist(user: any) {
    if (this.chatService.userService.getSyncProfile().id == user.id) {
      this.showBlacklist = false;
    } else {
      this.showBlacklist = true;
    }
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
  }*/
}
