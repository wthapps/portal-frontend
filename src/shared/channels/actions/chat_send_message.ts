import { Processable } from './processable';
import { ServiceManager } from '../../services';

declare let _:any;

export class ChatSendMessage implements Processable {
  constructor(private serviceManager: ServiceManager) {

  }

  process(data: any) {
    this.serviceManager.getChatCommonService().addMessage(data.data.group, data.data);
  }
}


