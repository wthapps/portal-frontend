import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBaseService, ChatCommonService, StorageService, UserService } from '@wth/shared/services';


declare var _: any;
declare var Promise: any;

@Injectable()
export class ChatContactService {

  constructor(
    public storage: StorageService,
    public apiBaseService: ApiBaseService,
    public chatCommonService: ChatCommonService,
    public router: Router
  ) {

  }

  addContact(ids: any, text?: any): Promise<any>{
    return this.apiBaseService.post('zone/chat/create_contact', {user_id: ids, text: text}).toPromise();
  }

  cancelContactRequest(contact: any): Promise<boolean> {
    const groupId = contact.group_id;
    return this.apiBaseService.post('zone/chat/contact/cancel', {group_id: groupId}).toPromise()
      .then(() => this.chatCommonService.setDefaultSelectContact())
    ;
  }

  getAll(query: string = '') {
    return this.apiBaseService.get('chat/contacts', query);
  }

  getSentToMe() {
    return this.apiBaseService.get('chat/contacts/sent_to_me');
  }
}
