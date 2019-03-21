import { ServiceManager } from '../../services';
import { CHAT_ACTIONS, CHAT_CONVERSATIONS, Constants } from '../../constant';

declare var _: any;

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
      ['ChatConversationService', 'ChatNotificationComponent'].forEach(component => {
        this.serviceManager.getCommonEventService().broadcast({
          channel: component,
          action: 'addNotificationEvent',
          payload: response.data
        })
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
      this.serviceManager.getCommonEventService().broadcast({
        channel: 'ChatConversationService',
        action: 'updateStoreConversationEvent',
        payload: response.data.group_user
      });
    }
    if (response.action === 'chat_notification' && response.data.type == 'update_conversation_list') {
      this.serviceManager.getCommonEventService().broadcast({
        channel: 'ChatConversationService',
        action: 'updateStoreConversationsEvent',
        payload: response.data.group_users
      });
    }
    if (response.action === 'chat_notification' && response.data.type == 'notification_message') {
      this.serviceManager.getCommonEventService().broadcast({
        channel: 'ConversationDetailComponent',
        action: 'updateMessageHandler',
        payload: response.data
      })
    }
  }
}
