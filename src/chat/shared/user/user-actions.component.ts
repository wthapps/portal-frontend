import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ChatService } from '../services/chat.service';
import { ZChatShareAddToConversationComponent } from '../modal/add-to-conversation.component';
import { ZSharedReportService } from '@wth/shared/shared/components/zone/report/report.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';


declare let $: any;

@Component({
  selector: 'w-user-actions',
  templateUrl: 'user-actions.component.html',
  styles: [':host{display: inline-block;}']
})
export class UserActionsComponent {
  @Input() contact: any;
  @Input() profileUrl: any;

  @Output() onConversate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onToggleBlacklist: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReport: EventEmitter<any> = new EventEmitter<any>();



  toggleBlacklist(contact: any) {
    this.onToggleBlacklist.emit(contact);
  }

  report(contact: any) {
    this.onReport.emit(contact);
  }

  remove(contact: any) {
    this.onRemove.emit(contact);
  }

}
