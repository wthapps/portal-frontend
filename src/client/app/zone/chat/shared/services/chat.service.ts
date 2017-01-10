import { Injectable }     from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { ApiBaseService } from '../../../../shared/services/apibase.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { Observable } from 'rxjs';

declare var _:any;

@Injectable()
export class ChatService {
  contactsHandlers: Array<any> = [];
  contactSelectHandler: Array<any> = [];

  constructor(public storage: StorageService, private apiBaseService: ApiBaseService, public user: UserService ) {}

  getContacts() {
    let res = this.storage.get('chat_contacts');
    if(res) {
      this.callContactHandlers(res);
    } else {
      this.apiBaseService.get('zone/chat/contacts').subscribe(
        (res:any) => {
          this.updateNewContacts(res)
        }
      )
    }
  }

  updateNewContacts(res:any, newContact?:any) {
    this.storage.save('chat_contacts', res);
    this.callContactHandlers(res, newContact);
  }

  callContactHandlers(res:any, newContact?:any) {
    for(let handler of this.contactsHandlers) {
      handler(res, newContact);
    }
  }

  onContactsUpdate(callback) {
    this.contactsHandlers.push(callback);
  }

  onContactSelect(callback) {
    this.contactSelectHandler.push(callback);
  }

  selectContact(contact) {
    this.storage.save('contact_select', contact);
    for(let handler of this.contactSelectHandler) {
      handler(contact);
    }
  }

  getContactSelect() {
    return this.storage.get('contact_select');
  }

  getFriends() {
    return this.apiBaseService.get('zone/chat/friends');
  }

  addContact(ids:number, callback?:any) {
    this.apiBaseService.post('zone/chat/create_contact', {user_id: ids}).subscribe(
      (res:any) => {
        let contacts = this.storage.get('chat_contacts');
        let index = _.findIndex(contacts.data, { id: res.data.id });
        if(index != -1) {
          this.updateNewContacts(contacts, res.data);
        } else {
          let contacts = this.storage.get('chat_contacts');
          contacts.data.push(res.data);
          this.updateNewContacts(contacts, res.data);
        }
      }
    )
  }

  getMessages(groupId:number, callback) {
    let res = this.storage.get('chat_messages_group_' + groupId);
    if(res) {
      console.log('get from store');
      callback(res);
    } else {
      console.log('get from api');
      this.apiBaseService.get('zone/chat/messages/' + groupId).subscribe(
        (res:any) => {
          this.storage.save('chat_messages_group_' + groupId, res);
          callback(res);
        }
      )
    }
  }
}
// constructor(private apiBaseService: ApiBaseService, private user: UserService) {
// }


