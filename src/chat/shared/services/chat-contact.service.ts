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

  addContact(ids: any, text?: any, callback?: any) {
    this.apiBaseService.post('zone/chat/create_contact', {user_id: ids, text: text}).subscribe(
      (res: any) => {
        this.chatCommonService.updateConversationBroadcast(res.data.group_id).then(res => {
          this.chatCommonService.moveFirstRecentList(res.data.group_id);
        });
        if(callback) {
          callback(res);
        }
      }
    );
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
