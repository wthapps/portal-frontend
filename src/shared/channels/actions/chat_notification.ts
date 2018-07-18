import { Processable } from './processable';
import { ServiceManager, StorageItem } from '../../services';
import { CHAT_CONVERSATIONS } from '@wth/shared/constant';

declare let _:any;

export class ChatNotification implements Processable {
  constructor(private serviceManager: ServiceManager) {

  }

  process(data: any) {
    if (data.data.type == 'notification_count') {
      this.addNotification(data);
    }
    if (data.data.type == 'added_contact') {
      this.addContact(data);
    }
    // if (data.data.type == 'removed_contact') {
    //   this.removeContact(data);
    // }
    if (data.data.type == 'update_display') {
      this.updateDisplay(data);
    }
    if (data.data.type == 'update_conversation_list') {
      this.updateConversationList(data);
    }
    if (data.data.type == 'notification_message') {
      this.addNotificationMessage(data);
    }
  }


  updateDisplay(data:any) {
    let item = this.serviceManager.getStorageService().find('chat_conversations');
    let index = _.findIndex(item.value.data, { id: data.data.group_user.id });
    if(index != -1) {
      item.value.data[index] = data.data.group_user;
      this.serviceManager.getChatCommonService().updateAll();
    }
  }

  addNotification(data:any) {
    let item = this.serviceManager.getStorageService().find('chat_conversations');
    if(item && item.value) {
      let contact = _.find(item.value.data, (contact:any) => {if(contact.group_json.id == data.data.group_id) return contact;});
      if (contact && contact.notification) {
        if (contact.notification) contact.notification_count = data.data.count;
        this.serviceManager.getChatCommonService().updateAll();
      }
    }
    if(data.data.count) this.serviceManager.handlerService.triggerEvent('on_notification_come', {count: 1});
  }

  addContact(data:any) {
    let item: StorageItem = this.serviceManager.getStorageService().find('chat_conversations');

    let index = _.findIndex(item.value.data, { id: data.data.group_user.id });
    if(index == -1) {
      item.value.data.unshift(data.data.group_user);
      this.serviceManager.getStorageService().save(CHAT_CONVERSATIONS, item.value);
    } else {
      item.value.data[index] = data.data.group_user;
    }
    this.serviceManager.getChatCommonService().updateAll();
  }

  // removeContact(data: any) {
  //   console.log('remove contact yo ...', data);
  //
  //   let item = this.serviceManager.getStorageService().find('chat_conversations');
  //
  //   let index = _.findIndex(item.value.data, { id: data.data.group_user.id });
  //   if(index !== -1) {
  //     item.value.data.splice(index, 1);
  //   }
  //   this.serviceManager.getChatCommonService().updateAll();
  // }

  updateConversationList(data:any) {
    let item = this.serviceManager.getStorageService().find('chat_conversations');
    item.value.data = data.data.group_users;
    this.serviceManager.getChatCommonService().updateAll();
  }

  addNotificationMessage(data:any) {
    this.serviceManager.getChatCommonService().addMessage(data.data.group, data.data);
  }
}
