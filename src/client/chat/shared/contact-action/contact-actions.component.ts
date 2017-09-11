import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { ZChatShareAddToConversationComponent } from '../modal/add-to-conversation.component';
import { ZSharedReportService } from '../../../core/shared/components/zone/report/report.service';
import { WthConfirmService } from '../../../core/shared/components/confirmation/wth-confirm.service';

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
  @Output() updateEvent: EventEmitter<any> = new EventEmitter<any>();
  // Config component
  @Input() config: any = {
    history: false
  };

  constructor(private router: Router,
              private chatService: ChatService,
              private zoneReportService: ZSharedReportService,
              private wthConfirmService: WthConfirmService) {
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
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to add this contact to black list ?',
      header: 'Add To Black List',
      accept: () => {
        this.chatService.addGroupUserBlackList(this.contact.partner_id);
      }
    });
  }

  disableNotification() {
    this.chatService.updateNotification(this.contact, {notification: false});
    this.contact.notification = !this.contact.notification;
  }

  enableNotification() {
    this.chatService.updateNotification(this.contact, {notification: true});
    this.contact.notification = !this.contact.notification;
  }

  deleteContact() {

    this.wthConfirmService.updateConfirmDialog({
      label: {
        accept: 'Delete'
      }
    });

    this.wthConfirmService.confirm({
      message: 'Are you sure you want to delete this contact ?',
      header: 'Delete Contact',
      accept: () => {
        this.chatService.deleteContact(this.contact);
        this.updateEvent.emit();
      }
    });
  }

  onFavorite() {
    this.chatService.addGroupUserFavorite(this.contact);
  }

  report(uuid: any) {
    this.zoneReportService.friend(uuid);
  }
}
