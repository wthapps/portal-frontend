import { StorageService, ApiBaseService } from "@shared/services";
import { CHAT_CONVERSATIONS, CONVERSATION_SELECT } from "@shared/constant";


export class ChatConversationMixin {
  constructor(public storage: StorageService, public apiBaseService: ApiBaseService) {}
  setConversations() {
    const contacts = this.storage.getValue(CHAT_CONVERSATIONS);
    this.storage.save(CHAT_CONVERSATIONS, { ...contacts });
  }

  setAllConversations(conversations_response) {
    this.storage.save(CHAT_CONVERSATIONS, conversations_response);
    this.setRecentConversations();
    this.setFavouriteConversations();
    this.setHistoryConversations();
    // this.setDefaultSelectContact();
  }

  setRecentConversations(): Promise<any> {
    const contacts = this.storage.getValue(CHAT_CONVERSATIONS).data;
    const recentContacts = _.filter(contacts, {
      favourite: false,
      black_list: false,
      history: false
    });
    this.storage.save('chat_recent_conversations', recentContacts);
    return Promise.resolve(recentContacts);
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

  setDefaultSelectContact(): Promise<any> {
    const res: any = this.storage.find(CHAT_CONVERSATIONS);
    if (res && res.value && res.value.data && res.value.data[0]) {
      const defaultContact = res.value.data[0];
      this.storage.save(CONVERSATION_SELECT, defaultContact);
      // this.handler.triggerEvent(
      //   'on_default_conversation_select',
      //   defaultContact
      // );
      // Resolve default select contact id
      return Promise.resolve(defaultContact.id);
    } else {
      // Resolve NO default select contact
      this.storage.save(CONVERSATION_SELECT, null);
      return Promise.resolve(null);
    }
  }

  updateAll() {
    this.setConversations();
    this.setRecentConversations();
    this.setFavouriteConversations();
    this.setHistoryConversations();
    this.updateContactSelect();
  }

  moveFirstRecentList(groupId?: string): Promise<any> {
    const chat_conversations = this.storage.getValue(CHAT_CONVERSATIONS);
    const conversations: any = chat_conversations.data;
    const latest_group = conversations.find(conv => conv.group_id === groupId);
    const contactSelect: any = latest_group || this.storage.getValue(CONVERSATION_SELECT);
    _.pullAllBy(
      conversations,
      [{ group_id: contactSelect.group_id }],
      'group_id'
    );
    conversations.unshift(contactSelect);
    _.uniqBy(conversations, 'id');

    this.storage.save(CHAT_CONVERSATIONS, { ...chat_conversations, data: conversations });
    return this.setRecentConversations();
  }
}
