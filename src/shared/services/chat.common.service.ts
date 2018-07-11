import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ApiBaseService } from './apibase.service';
import { HandlerService } from './handler.service';
import { UserService } from '@wth/shared/services/user.service';
import { WMessageService } from '@wth/shared/services/message.service';
import { Router } from '@angular/router';
import { CONVERSATION_SELECT } from '@wth/shared/constant';

declare var _: any;
declare var Promise: any;

@Injectable()
export class ChatCommonService {
  constructor(
    public storage: StorageService,
    public apiBaseService: ApiBaseService,
    public handler: HandlerService,
    private messageService: WMessageService,
    private router: Router,
    private userService: UserService
  ) {}

  setRecentConversations() {
    let contacts = this.storage.find('chat_conversations').value.data;
    let recentContacts = _.filter(contacts, {
      favourite: false,
      black_list: false,
      history: false
    });
    this.storage.save('chat_recent_conversations', recentContacts);
  }

  setFavouriteConversations() {
    let contacts = this.storage.find('chat_conversations').value.data;
    let favouriteContacts = _.filter(contacts, {
      favourite: true,
      black_list: false
    });
    this.storage.save('chat_favourite_conversations', favouriteContacts);
  }

  setHistoryConversations() {
    let contacts = this.storage.find('chat_conversations').value.data;
    let historyContacts = _.filter(contacts, {
      history: true,
      black_list: false
    });
    this.storage.save('chat_history_conversations', historyContacts);
  }

  moveFristRecentList() {
    let contactSelect: any = this.storage.find('conversation_select').value;
    let conversations: any = this.storage.find('chat_conversations').value.data;
    _.pullAllBy(
      conversations,
      [{ group_id: contactSelect.group_id }],
      'group_id'
    );
    conversations.unshift(contactSelect);
    _.uniqBy(conversations, 'id');
  }

  addMessage(groupId: any, data: any) {
    let message = data.message;
    message.links = data.links;
    let item = this.storage.find('chat_messages_group_' + groupId);
    if (this.storage.find('conversation_select')) {
      let contactSelect = this.storage.find('conversation_select').value;
      if (item && item.value) {
        let isReplace = false;
        for (let i = 0; i < item.value.data.length; i++) {
          if (item.value.data[i].id == message.id) {
            isReplace = true;
            item.value.data[i] = message;
          }
        }
        if (!isReplace) {
          item.value.data.push(message);
        }
        if (contactSelect.group_json.id == groupId) {
          this.storage.save('current_chat_messages', item);
        }
        if (!contactSelect.favourite) {
          this.moveFristRecentList();
        }
        // Scroll to bottom when user's own messages are arrived
        if(message.user_id === this.userService.getSyncProfile().id)
          this.messageService.scrollToBottom();
      }
    }
  }

  updateItemInList(groupId: any, data: any) {
    let items = this.storage.find('chat_messages_group_' + groupId);
    if (items && items.value) {
      for (let i = 0; i < items.value.data.length; i++) {
        if (items.value.data[i].id == data.id) {
          items.value.data[i] = data;
        }
      }
    }

    if(data && data.byMe)
      this.messageService.scrollToBottom();
  }

  updateContactSelect() {
    let contactSelect = this.storage.find('conversation_select').value;
    let chatContacts = this.storage.find('chat_conversations').value.data;
    if (chatContacts) {
      let isSet = false;
      for (let i = 0; i < chatContacts.length; i++) {
        if (chatContacts[i] && contactSelect && chatContacts[i].id == contactSelect.id) {
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

  updateConversationBroadcast(groupId: any): Promise<any> {
    return this.apiBaseService
      .post('zone/chat/notification/broadcard_contact', { group_id: groupId })
      .toPromise();
  }

  setDefaultSelectContact(): Promise<any> {
    let res: any = this.storage.find('chat_conversations');
    if (res && res.value && res.value.data && res.value.data[0]) {
      const defaultContact = res.value.data[0];
      this.storage.save(CONVERSATION_SELECT, defaultContact);
      this.handler.triggerEvent(
        'on_default_conversation_select',
        defaultContact
      );
      // Resolve default select contact id
      return Promise.resolve(defaultContact.id);
    } else {
      // Resolve NO default select contact
      this.storage.save(CONVERSATION_SELECT, null);
      return Promise.resolve(null);
    }
  }
}
