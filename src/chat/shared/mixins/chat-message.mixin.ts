import { StorageService, WMessageService, CommonEventService, ApiBaseService, UserService } from "@shared/services";
import { CHAT_CONVERSATIONS, CONVERSATION_SELECT, ACTION, CHAT_MESSAGES_GROUP_ } from "@shared/constant";

declare var _: any;

export class ChatMessageMixin {
  constructor(public storage: StorageService,
    public wMessageService: WMessageService,
    public commonEventService: CommonEventService,
    public userService: UserService,
    public apiBaseService: ApiBaseService) {}

  updateItemInList(groupId: any, data: any) {
    const items = this.storage.find('chat_messages_group_' + groupId);
    const contactSelect = this.storage.getValue(CONVERSATION_SELECT);
    if (items && items.value) {
      for (let i = 0; i < items.value.data.length; i++) {
        if (items.value.data[i].id === data.id) {
          items.value.data[i] = data;
        }
      }
    }

    if (contactSelect && contactSelect.group.id === groupId) {
      console.log('sending messages to current group: ', { action: ACTION.EDIT, data });
    }

    if (data && data.byMe)
      this.wMessageService.scrollToBottom();
  }

  // Update another conversations to update their status
  updateConversationBroadcast(groupId: any): Promise<any> {
    return this.apiBaseService
      .post('zone/chat/notification/broadcard_contact', { group_id: groupId })
      .toPromise();
  }

  updateMessage(groupId: any, data: any): void {
    const message = data.message;
    // if (data.links) message.links = data.links;
    let currentMessageList: any = this.storage.getValue(CHAT_MESSAGES_GROUP_ + groupId);
    const contactSelect = this.storage.getValue(CONVERSATION_SELECT);
    const conversationsResponse = this.storage.getValue(CHAT_CONVERSATIONS);
    // if no conversations
    if (!conversationsResponse || !conversationsResponse.data)
      return;
    // conversation contain this message
    const incomingConversation = conversationsResponse.data.find(conv => conv.group.id === groupId);
    // show conversation if deleting
    if (incomingConversation === undefined && contactSelect.group_type === 'couple') {
      // Update another conversations to update their status
      this.updateConversationBroadcast(groupId);
    }
    if (currentMessageList) {
      if (message.deleted) {
        currentMessageList.data = currentMessageList.data.filter(m => m.id !== message.id);
      } else {
        let isReplace = false;
        for (let i = 0; i < currentMessageList.data.length; i++) {

          if (currentMessageList.data[i].id == message.id) {
            isReplace = true;
            currentMessageList.data[i] = message;
          }
        }
        if (!isReplace) {
          currentMessageList.data.push(message);
        }
      }
    }
  }
}
