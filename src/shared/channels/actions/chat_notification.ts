import { Processable } from './processable';
import { ServiceManager, StorageItem, WTHNavigateService } from '../../services';
import { CHAT_CONVERSATIONS, Constants } from '@wth/shared/constant';

declare let _: any;

export class ChatNotification implements Processable {
  constructor(private serviceManager: ServiceManager) {

  }

  process(data: any) {
    if (data.data.type === 'notification_count') {
      this.addNotification(data);
    }
    if (data.data.type === 'added_contact') {
      this.addContact(data);
    }
    if (data.data.type === 'update_display') {
      this.updateDisplay(data);
    }
    if (data.data.type === 'update_conversation_list') {
      this.updateConversationList(data);
    }
    if (data.data.type === 'notification_message') {
      this.addNotificationMessage(data);
    }
  }


  updateDisplay(data) {
    const item = this.serviceManager.getStorageService().find(CHAT_CONVERSATIONS);
    const index = _.findIndex(item.value.data, { id: data.data.group_user.id });
    if (index !== -1) {
      item.value.data[index] = data.data.group_user;
    }
  }

  addNotification(data: any) {
    const conversations = this.serviceManager.getStorageService().getValue(CHAT_CONVERSATIONS);
    if (conversations) {
      const contact = _.find(conversations.data,
        (ct: any) =>  (ct.group.id.toString() === data.data.group_id.toString())
      );
      if (contact && contact.notification) {
        if (contact.notification) contact.notification_count = data.data.count;
      }
    }
    if (data.data.count && !this.inSameModule([Constants.baseUrls.chat]))
      this.serviceManager.handlerService.triggerEvent('on_notification_come', {count: 1});
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
  }

  updateConversationList(data: any) {
    const item = this.serviceManager.getStorageService().find(CHAT_CONVERSATIONS);
    item.value.data = data.data.group_users;
  }

  addNotificationMessage(data: any) {
    // this.serviceManager.getChatCommonService().addMessage(data.data.group, data.data);
  }

  private inSameModule(moduleNames: string[]) {
    return moduleNames.includes(window.location.origin);
  }
}
