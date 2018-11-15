import { Processable } from './processable';
import { ServiceManager, CommonEventService } from '../../services';
import { ConversationDetailComponent } from '@chat/conversation/conversation-detail.component';

declare let _: any;

export class ChatSendMessage implements Processable {
  constructor(private serviceManager: ServiceManager) {

  }

  process(data: any) {
    // this.serviceManager.getChatCommonService().addMessage(data.data.group, data.data);
    this.serviceManager.getCommonEventService().broadcast({
      channel: ConversationDetailComponent.name,
      action: 'updateMessageHandler',
      payload: data.data
    })
  }
}


