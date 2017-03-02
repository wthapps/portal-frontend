import { Injectable }     from '@angular/core';
import { StorageService } from '../../../core/shared/services/storage.service';

declare var _:any;

@Injectable()
export class ChatCommonService {
  constructor(public storage: StorageService) {}

  setRecentContacts() {
    let contacts = this.storage.find('chat_contacts').value.data;
    let recentContacts = _.filter(contacts, { 'favourite': false, 'black_list': false, 'history': false });
    this.storage.save('chat_recent_contacts', recentContacts);
  }

  setFavouriteContacts() {
    let contacts = this.storage.find('chat_contacts').value.data;
    let favouriteContacts = _.filter(contacts, { 'favourite': true, 'black_list': false });
    this.storage.save('chat_favourite_contacts', favouriteContacts);
  }

  setHistoryContacts() {
    let contacts = this.storage.find('chat_contacts').value.data;
    let historyContacts = _.filter(contacts, { 'history': true, 'black_list': false });
    this.storage.save('chat_history_contacts', historyContacts);
  }
}


