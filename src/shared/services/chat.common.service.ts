import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ApiBaseService } from './apibase.service';
import { HandlerService } from './handler.service';
import { UserService } from '@wth/shared/services/user.service';
import { WMessageService } from '@wth/shared/services/message.service';
import { Router } from '@angular/router';
import { CONVERSATION_SELECT, CURRENT_CHAT_MESSAGES, CHAT_CONVERSATIONS } from '@wth/shared/constant';

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

  setConversations() {
    const contacts = this.storage.getValue(CHAT_CONVERSATIONS);
    this.storage.save(CHAT_CONVERSATIONS, {...contacts});
  }

  setRecentConversations() {
    const contacts = this.storage.getValue(CHAT_CONVERSATIONS).data;
    const recentContacts = _.filter(contacts, {
      favourite: false,
      black_list: false,
      history: false
    });
    this.storage.save('chat_recent_conversations', recentContacts);
  }

  setFavouriteConversations() {
    const contacts = this.storage.getValue(CHAT_CONVERSATIONS).data;
    const favouriteContacts = _.filter(contacts, {
      favourite: true,
      black_list: false
    });
    this.storage.save('chat_favourite_conversations', favouriteContacts);
  }

  setHistoryConversations() {
    const contacts = this.storage.getValue(CHAT_CONVERSATIONS).data;
    const historyContacts = _.filter(contacts, {
      history: true,
      black_list: false
    });
    this.storage.save('chat_history_conversations', historyContacts);
  }

  moveFristRecentList() {
    const contactSelect: any = this.storage.getValue(CONVERSATION_SELECT);
    const chat_conversations = this.storage.getValue(CHAT_CONVERSATIONS);
    const conversations: any = chat_conversations.data;
    _.pullAllBy(
      conversations,
      [{ group_id: contactSelect.group_id }],
      'group_id'
    );
    conversations.unshift(contactSelect);
    _.uniqBy(conversations, 'id');

    console.log('update move first recent list and conversation list ...', conversations);
    this.storage.save(CHAT_CONVERSATIONS, {...chat_conversations, data: conversations});
  }

  addMessage(groupId: any, data: any): void {
    const message = data.message;
    message.links = data.links;
    const currentMessageList = this.storage.getValue('chat_messages_group_' + groupId);
    const contactSelect = this.storage.getValue(CONVERSATION_SELECT);
    const conversationsResponse = this.storage.getValue(CHAT_CONVERSATIONS);
    if (contactSelect) {
      if (currentMessageList) {
        let isReplace = false;
        for (let i = 0; i < currentMessageList.data.length; i++) {
          if (currentMessageList.data[i].id === message.id) {
            isReplace = true;
            currentMessageList.data[i] = message;
          }
        }
        if (!isReplace) {
          currentMessageList.data.push(message);
        }
        if (contactSelect.group_json.id === groupId) {
          this.storage.save('current_chat_messages', currentMessageList);
        }
        if (!contactSelect.favourite) {
          this.moveFristRecentList();
        }
        // Scroll to bottom when user's own messages are arrived
        if (message.user_id === this.userService.getSyncProfile().id)
          this.messageService.scrollToBottom();
      }
    }
    if (!conversationsResponse)
      return;
    for (const conversation of conversationsResponse.data) {
      if (conversation.group_json.id === groupId)
        conversation.latest_message = message;
    }
    this.storage.save(CHAT_CONVERSATIONS, conversationsResponse);
    this.setRecentConversations();
    this.setFavouriteConversations();
    this.setHistoryConversations();
  }

  updateItemInList(groupId: any, data: any) {
    const items = this.storage.find('chat_messages_group_' + groupId);
    if (items && items.value) {
      for (let i = 0; i < items.value.data.length; i++) {
        if (items.value.data[i].id === data.id) {
          items.value.data[i] = data;
        }
      }
    }

    // this.storage.save('chat_messages_group_' + groupId, items.value);
    this.storage.save(CURRENT_CHAT_MESSAGES, items.value);

    if (data && data.byMe)
      this.messageService.scrollToBottom();
  }

  updateContactSelect() {
    const contactSelect = this.storage.getValue(CONVERSATION_SELECT);
    const chatContacts = this.storage.getValue(CHAT_CONVERSATIONS).data;
    if (chatContacts) {
      let isSet = false;
      for (let i = 0; i < chatContacts.length; i++) {
        if (chatContacts[i] && contactSelect && chatContacts[i].id === contactSelect.id) {
          this.storage.save(CONVERSATION_SELECT, chatContacts[i]);
          isSet = true;
        }
      }
      if (!isSet) {
        this.setDefaultSelectContact();
      }
    }
  }

  updateAll() {
    this.setConversations();
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
    const res: any = this.storage.find(CHAT_CONVERSATIONS);
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
