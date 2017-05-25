import { ServiceManager } from '../../services/service-manager';

declare let _:any;

export class ChatNotification {
  constructor(private data:any, private serviceManager:ServiceManager) {

  }

  process() {
    if (this.data.type == 'notification_count') {
      this.addNotification(this.data);
    }
    if (this.data.type == 'added_contact') {
      this.addContact(this.data);
    }
    if (this.data.type == 'update_display') {
      this.updateDisplay(this.data);
    }
    if (this.data.type == 'update_conversation_list') {
      this.updateConversationList(this.data);
    }
  }


  updateDisplay(data:any) {
    let item = this.serviceManager.getStorageService().find('chat_contacts');
    let index = _.findIndex(item.value.data, { id: data.group_user.id });
    if(index != -1) {
      item.value.data[index] = data.group_user;
      this.serviceManager.getChatCommonService().updateAll();
    }
  }

  addNotification(data:any) {
    let item = this.serviceManager.getStorageService().find('chat_contacts');
    if(item && item.value) {
      let contact = _.find(item.value.data, (contact:any) => {if(contact.group_json.id == data.group_id) return contact;});
      if (contact && contact.notification) {
        contact.notification_count = data.count;
        this.serviceManager.getChatCommonService().updateAll();
      }
    }
  }

  addContact(data:any) {
    let item = this.serviceManager.getStorageService().find('chat_contacts');
    let index = _.findIndex(item.value.data, { id: data.group_user.id });
    if(index == -1) {
      item.value.data.push(data.group_user);
    } else {
      item.value.data[index] = data.group_user;
    }
    this.serviceManager.getChatCommonService().updateAll();
  }

  updateConversationList(data:any) {
    console.log(data);
    let item = this.serviceManager.getStorageService().find('chat_contacts');
    item.value.data = data.group_users;
    this.serviceManager.getChatCommonService().updateAll();
    // this.serviceManager.getStorageService().save('chat_contacts', item);
  }
}


