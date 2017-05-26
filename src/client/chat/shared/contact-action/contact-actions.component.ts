import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { ZChatShareAddToConversationComponent } from '../modal/add-to-conversation.component';
import { ConfirmationService } from 'primeng/components/common/api';
import { ZoneReportService } from '../../../core/shared/form/report/report.service';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-actions',
  templateUrl: 'contact-actions.component.html',
  styles: [':host{display: inline-block;}']
})
export class ZChatContactActionsComponent implements OnInit {
  @Input() contact: any;
  conversationUrl: any;
  profileUrl: any;
  @ViewChild('addConversation') addConversation: ZChatShareAddToConversationComponent;
  // Config component
  @Input() config: any = {
    history: false
  };

  constructor(private router: Router,
              private chatService: ChatService,
              private zoneReportService: ZoneReportService,
              private confirmationService: ConfirmationService) {
    this.conversationUrl = this.chatService.constant.conversationUrl;
    this.profileUrl = this.chatService.constant.profileUrl;
  }

  ngOnInit() {
    //   console.log(this.config)
  }

  onSelect(contact: any) {
    console.log(contact);
    if (this.config.history) {
      this.chatService.updateHistory(contact);
    }
    $('#chat-message-text').focus();
    this.chatService.selectContact(contact);

    this.router.navigate([this.conversationUrl, contact.id]);
  }

  addToConversation() {
    this.addConversation.modal.open();
  }

  addBlackList() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to add this contact to black list ?',
      header: 'Add To Black List',
      accept: () => {
        this.chatService.addGroupUserBlackList(this.contact);
      }
    });
  }

  disableNotification() {
    this.chatService.updateNotification(this.contact, {notification: false});
  }

  enableNotification() {
    this.chatService.updateNotification(this.contact, {notification: true});
  }

  deleteContact() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this contact ?',
      header: 'Delete Contact',
      accept: () => {
        this.chatService.deleteContact(this.contact);
      }
    });
  }

  onFavorite() {
    this.chatService.addGroupUserFavorite();
  }

  report(uuid: any) {
    this.zoneReportService.friend(uuid);
  }
}
