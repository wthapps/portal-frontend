import { ServiceManager } from '../../services';
import { CHAT_ACTIONS, CHAT_CONVERSATIONS, Constants } from '../../constant';

export class ChatActions {
  constructor(private serviceManager: ServiceManager) {

  }

  process(response: any) {
    if (response.action === 'chat_send_message') {
      this.serviceManager.getCommonEventService().broadcast({
        channel: 'ConversationDetailComponent',
        action: 'updateMessageHandler',
        payload: response.data
      })
    }
    if (response.action === 'chat_notification' && response.data.type == 'notification_count') {
      this.serviceManager.getCommonEventService().broadcast({
        channel: 'ChatConversationService',
        action: 'addNotification',
        payload: response.data
      })
    }

    if (response.action === 'chat_notification' && response.data.type == 'added_contact') {
      this.serviceManager.getCommonEventService().broadcast({
        channel: 'ChatConversationService',
        action: 'addRemoveMember',
        payload: response.data
      });
    }

    if (response.action === 'chat_notification' && response.data.type == 'update_display') {
      this.updateDisplay(response);
    }
    if (response.action === 'chat_notification' && response.data.type == 'update_conversation_list') {
      this.updateConversationList(response);
    }
    if (response.action === 'chat_notification' && response.data.type == 'notification_message') {
      this.serviceManager.getCommonEventService().broadcast({
        channel: 'ConversationDetailComponent',
        action: 'updateMessageHandler',
        payload: response.data
      })
    }
  }

  updateDisplay(data) {
    const item = this.serviceManager.getStorageService().find(CHAT_CONVERSATIONS);
    const index = _.findIndex(item.value.data, { id: data.data.group_user.id });
    if (index !== -1) {
      item.value.data[index] = data.data.group_user;
      this.serviceManager.getChatCommonService().updateAll();
    }
  }

  addContact(data: any) {
    const conversations = this.serviceManager.getStorageService().getValue(CHAT_CONVERSATIONS);
    if (!conversations)
      return;
    const index = _.findIndex(conversations.data, { id: data.data.group_user.id });
    if (index === -1) {
      conversations.data.unshift(data.data.group_user);
      this.serviceManager.getStorageService().save(CHAT_CONVERSATIONS, conversations);
    } else {
      conversations.data[index] = data.data.group_user;
    }
    this.serviceManager.getChatCommonService().updateAll();
  }

  updateConversationList(data: any) {
    const item = this.serviceManager.getStorageService().find(CHAT_CONVERSATIONS);
    item.value.data = data.data.group_users;
    this.serviceManager.getChatCommonService().updateAll();
  }

  addNotificationMessage(data: any) {
    this.serviceManager.getChatCommonService().addMessage(data.data.group, data.data);
  }

  private inSameModule(moduleNames: string[]) {
    return moduleNames.includes(window.location.origin);
  }
}
