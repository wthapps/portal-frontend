import { Injectable }     from '@angular/core';
import { StorageService } from './storage.service';
import { ApiBaseService } from './apibase.service';
import { HandlerService } from './handler.service';

declare var _:any;

@Injectable()
export class ChatCommonService {
  constructor(public storage: StorageService, public apiBaseService: ApiBaseService, public handler: HandlerService) {}

  setRecentConversations() {
    let contacts = this.storage.find('chat_conversations').value.data;
    let recentContacts = _.filter(contacts, { 'favourite': false, 'black_list': false, 'history': false });
    this.storage.save('chat_recent_conversations', recentContacts);
  }

  setFavouriteConversations() {
    let contacts = this.storage.find('chat_conversations').value.data;
    let favouriteContacts = _.filter(contacts, { 'favourite': true, 'black_list': false });
    this.storage.save('chat_favourite_conversations', favouriteContacts);
  }

  setHistoryConversations() {
    let contacts = this.storage.find('chat_conversations').value.data;
    let historyContacts = _.filter(contacts, { 'history': true, 'black_list': false });
    this.storage.save('chat_history_conversations', historyContacts);
  }

  moveFristRecentList() {
    let contactSelect:any = this.storage.find('conversation_select').value;
    let conversations:any = this.storage.find('chat_conversations').value.data;
    _.pullAllBy(conversations, [{ 'group_id': contactSelect.group_id }], 'group_id');
    conversations.unshift(contactSelect);
    _.uniqBy(conversations, 'id');
  }

  addMessage(groupId:any, data:any) {
    let message = data.message;
    message.links = data.links;
    let item = this.storage.find('chat_messages_group_' + groupId);
    let contactSelect = this.storage.find('conversation_select').value;
    if (item && item.value) {
      let isReplace = false;
      for (let i = 0; i < item.value.data.length; i++) {
        if(item.value.data[i].id == message.id) {
          isReplace = true;
          item.value.data[i] = message;
        }
      }
      if (!isReplace) {
        item.value.data.push(message);
      }
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
    if (items && items.value) {
      for (let i = 0; i < items.value.data.length; i++) {
        if(items.value.data[i].id == data.id) {
          items.value.data[i] = data;
        }
      }
    }
  }

  updateContactSelect() {
    let contactSelect = this.storage.find('conversation_select').value;
    let chatContacts = this.storage.find('chat_conversations').value.data;
    if (chatContacts) {
      let isSet = false;
      for (let i = 0; i < chatContacts.length; i++) {
        if (chatContacts[i] && chatContacts[i].id == contactSelect.id) {
          this.storage.save('conversation_select', chatContacts[i]);
          isSet = true;
        }
      }
      if (!isSet) {
        this.setDefaultSelectContact();
      }
    }
  }

  updateAll() {
    this.setRecentConversations();
    this.setFavouriteConversations();
    this.setHistoryConversations();
    this.updateContactSelect();
  }

  updateConversationBroadcast(groupId: any) {
    this.apiBaseService.post('zone/chat/notification/broadcard_contact', {group_id: groupId}).subscribe((res: any) => {
      // code goto core/shared/channels/actions/chat_notification.ts
    });
  }

  setDefaultSelectContact() {
    let res: any = this.storage.find('chat_conversations');
    if (res && res.value && res.value.data[0]) {
      this.storage.save('conversation_select', res.value.data[0]);
      this.handler.triggerEvent('on_default_conversation_select', res.value.data[0]);
    }
  }
}
