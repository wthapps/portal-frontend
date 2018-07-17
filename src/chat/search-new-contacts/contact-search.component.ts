import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChatService } from '../shared/services/chat.service';
import { ZChatShareRequestContactComponent } from '../shared/modal/request-contact.component';
import { Constants } from '@wth/shared/constant';

@Component({
  selector: 'z-chat-contact-search',
  templateUrl: 'contact-search.component.html',
  styleUrls: ['contact-search.component.scss']
})
export class ZChatContactSearchComponent implements OnInit {
  readonly tooltip: any = Constants.tooltip;

  contactItem$: Observable<any>;
  name: any;
  newContacts: any;
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.contactItem$ = this.chatService.getConversationsAsync();
  }

  search() {
    this.chatService.searchUsers(this.name).subscribe((res: any) => {
      this.newContacts = res.data;
    });
  }

  onRequest(contact: any) {
    this.requestModal.contact = contact;
    this.requestModal.modal.open();
  }
}
