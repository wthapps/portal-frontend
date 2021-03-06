import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { ZChatShareAddToConversationComponent } from '../modal/add-to-conversation.component';
import { ZSharedReportService } from '@wth/shared/shared/components/zone/report/report.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { ChatConversationService } from '../services/chat-conversation.service';


declare let $: any;

@Component({
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
  @Output() editEvent: EventEmitter<any> = new EventEmitter<any>();
  // Config component
  @Input() config: any = {
    history: false
  };

  constructor(private router: Router,
              private chatService: ChatService,
              private chatConversationService: ChatConversationService,
              private toastsService: ToastsService,
              private zoneReportService: ZSharedReportService,
              private wthConfirmService: WthConfirmService) {
    this.conversationUrl = this.chatService.constant.conversationUrl;
    this.profileUrl = this.chatService.constant.profileUrl;
  }

  ngOnInit() {
    //   console.log(this.config)
  }

  onSelect(contact: any) {
    $('#chat-message-text').focus();
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
    this.wthConfirmService.confirm({
      acceptLabel: 'Delete',
      message: 'Are you sure you want to delete this contact ?',
      header: 'Delete Contact',
      accept: () => {
        this.chatService.deleteContact(this.contact);
        this.updateEvent.emit();
      }
    });
  }

  onFavorite() {
    this.chatConversationService.apiFavoriteGroupUser(this.contact);
  }

  report(uuid: any) {
    this.zoneReportService.friend(uuid);
  }

  viewConversation() {
    this.router.navigate([this.conversationUrl, this.contact.id]);
  }

  editConversation() {
    this.editEvent.emit(this.contact);
  }

  leaveConversation() {
    this.chatConversationService.leaveConversation(this.contact)
      .then(_ => this.toastsService.success(`You have left conversation '${this.contact.display.name}' successfully`));
  }
}
