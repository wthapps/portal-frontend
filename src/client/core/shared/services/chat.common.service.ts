import { Injectable }     from '@angular/core';
import { StorageService } from './storage.service';

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

  moveFristRecentList() {
    let contactSelect:any = this.storage.find('contact_select').value;
    let chatRecentContacts:any = this.storage.find('chat_recent_contacts').value;
    chatRecentContacts.unshift(contactSelect);
    chatRecentContacts = _.uniqBy(chatRecentContacts, 'id');
    this.storage.save('chat_recent_contacts', chatRecentContacts);
  }

  addMessage(groupId:any, data:any) {
    let item = this.storage.find('chat_messages_group_' + groupId);
    let contactSelect = this.storage.find('contact_select').value;
    if (item && item.value) {
      item.value.data.push(data);
      if(contactSelect.group_json.id == groupId) {
        this.storage.save('current_chat_messages', item);
      }
      if (!contactSelect.favourite) {
        this.moveFristRecentList();
      }
    }
  }

  updateItemInList(groupId: any, data: any) {
    let items = this.storage.find('chat_messages_group_' + groupId);
    // let contactSelect = this.storage.find('contact_select').value;
    if (items && items.value) {
      let currentItemIndex = _.findIndex(items.value.data, {id: data.id});
      // replace current item in array
      items.value.data.splice(currentItemIndex, 1, data);
      // if(contactSelect.group_json.id == groupId) {
        this.storage.save('chat_messages_group_' + groupId, items);
      // }
      // if (!contactSelect.favourite) {
      //   this.moveFristRecentList();
      // }
    }
  }

  updateContactSelect() {
    let contactSelect = this.storage.find('contact_select').value;
    let chatContacts = this.storage.find('chat_contacts').value.data;
    for (let i = 0; i < chatContacts.length; i++) {
      if (chatContacts[i].id == contactSelect.id) {
        this.storage.save('contact_select', chatContacts[i]);
      }
    }
  }

  updateAll() {
    this.setRecentContacts();
    this.setFavouriteContacts();
    this.setHistoryContacts();
    this.updateContactSelect();
  }
}


