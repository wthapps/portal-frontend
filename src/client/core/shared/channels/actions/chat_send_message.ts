import { ServiceManager } from '../../services/service-manager';

declare let _:any;

export class ChatSendMessage {
  constructor(private data:any, private serviceManager:ServiceManager) {

  }

  process() {
    this.serviceManager.getChatCommonService().addMessage(this.data.group, this.data.message);
  }
}


