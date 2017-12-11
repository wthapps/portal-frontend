import { ServiceManager } from '../../services/service-manager';
import { CHAT_ACTIONS } from '../../../constant/chat-constant';

export class ChatActions {
  constructor(private serviceManager: ServiceManager) {

  }

  process(response: any) {
    let data = response.data;

    switch (response.action) {
      case CHAT_ACTIONS.CHAT_MESSAGE_DELETE:
      case CHAT_ACTIONS.CHAT_MESSAGE_UPDATE:
        console.log('chat operation message', data);

        this.serviceManager.getChatCommonService().updateItemInList(data.group_id, data);
        break;
      default:
        console.log('chat operation create', data);

        this.serviceManager.getChatCommonService().addMessage(data.group, data);
        break;
    }

    // this.serviceManager.getStorageService().save('users_online', response.data);
  }
}
