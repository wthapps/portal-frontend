import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChatService } from '../shared/services/chat.service';
import { ApiBaseService } from '@wth/shared/services';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { ContactSelectionService } from '@chat/shared/selections/contact/contact-selection.service';

@Component({
  selector: 'z-chat-contact',
  templateUrl: 'contact.component.html'
})
export class ZChatContactComponent implements OnInit {
  contact$: any;
  usersOnlineItem$: Observable<any>;
  count: any;

  constructor(
    private chatService: ChatService,
    public apiBaseService: ApiBaseService,
    private chatContactService: ChatContactService,
    private contactSelectionService: ContactSelectionService
  ) {}

  ngOnInit() {
    // this.usersOnlineItem$ = this.chatService.getUsersOnline();

    this.chatContactService.getAll().subscribe(response => {
      this.contact$ = response.data;
    });

    this.apiBaseService
      .post('zone/chat/contact/contact_tab_count')
      .subscribe((res: any) => {
        this.count = res.data;
      });
  }

  newContact() {
    this.contactSelectionService.open({type: 'addContact'});
  }
}
