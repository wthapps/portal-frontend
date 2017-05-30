import { ServiceManager } from '../../services/service-manager';
import { CHAT_ACTIONS } from '../../../../chat/shared/constants/chat-constant';

export class ChatActions {
  constructor(private serviceManager: ServiceManager) {

  }

  update(response: any) {
    switch (response.action) {
      case CHAT_ACTIONS.CHAT_MESSAGE_DELETE:
        console.log('data;;;;;;;;;;;;;;', response.data);
        this.serviceManager.getChatCommonService().updateItemInList(response.data.group_id, response.data);
        break;

    }

    // this.serviceManager.getStorageService().save('users_online', response.data);
  }
}
