import { Injectable }     from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/shared/services/user.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { StorageService } from '../../../core/shared/services/storage.service';
import { HandlerService } from '../../../core/shared/services/handler.service';
import { ChatChannelService } from '../../../core/shared/channels/chat-channel.service';
import { ChatNotificationChannelService } from '../../../core/shared/channels/chat-notification-channel.service';
import { FileUploadHelper } from '../../../core/shared/helpers/file/file-upload.helper';

declare var _:any;

@Injectable()
export class ChatService {
  fileUploadHelper:any;

  constructor(public storage: StorageService,
              private apiBaseService: ApiBaseService,
              public user: UserService,
              public chanel: ChatChannelService,
              public notificationChannel: ChatNotificationChannelService,
              public router: Router,
              public handler: HandlerService) {
    this.storage.save('chat_contacts', null);
    this.storage.save('contact_select', null);
    this.storage.save('current_chat_messages', null);
    this.fileUploadHelper = new FileUploadHelper();
  }

  getContacts() {
    let res:any = this.storage.find('chat_contacts');
    if(res && res.value) {
      return res;
    } else {
      this.apiBaseService.get('zone/chat/contacts').subscribe(
        (res:any) => {
          this.storage.save('chat_contacts', res);
          this.setDefaultSelectContact();
        }
      );
      return res;
    }
  }

  addContact(ids:number) {
    this.apiBaseService.post('zone/chat/create_contact', {user_id: ids}).subscribe(
      (res:any) => {
        let item = this.storage.find('chat_contacts');
        let index = _.findIndex(item.value.data, { id: res.data.id });
        if(index != -1) {
          // this.handler.triggerEvent('on_contacts_change', res);
        } else {
          item.value.data.push(res.data);
          // this.handler.triggerEvent('on_contacts_change', res);
        }
      }
    );
  }

  setDefaultSelectContact() {
    let res:any = this.storage.find('chat_contacts');
    if(res && res.value && res.value.data[0]) {
      this.storage.save('contact_select', res.value.data[0]);
      this.handler.triggerEvent('on_default_contact_select', res.value.data[0]);
    }
  }

  selectContact(contact:any) {
    this.storage.save('contact_select', contact);
    this.handler.triggerEvent('on_contact_select', contact);
  }

  getContactSelect() {
    return this.storage.find('contact_select');
  }

  getFriends() {
    return this.apiBaseService.get('zone/chat/friends');
  }

  getMessages(groupId:number) {
    let item:any = this.storage.find('chat_messages_group_' + groupId);
    if(item && item.value) {
      this.storage.save('current_chat_messages', item.value);
    } else {
      this.apiBaseService.get('zone/chat/messages/' + groupId).subscribe(
        (res:any) => {
          this.storage.save('chat_messages_group_' + groupId, res);
          this.storage.save('current_chat_messages', res);
        }
      );
    }
  }

  getCurrentMessages() {
    this.handler.addListener('get_messages_after_select', 'on_contact_select', (contact:any) => {
      this.getMessages(contact.group.id);
    });
    return this.storage.find('current_chat_messages');
  }

  subscribeChanel() {
    this.handler.addListener('subscribe_chanel_after_select', 'on_contact_select', (contact:any) => {
      this.chanel.subscribe(contact.group.id);
    });
  }

  subscribeNotification() {
    this.handler.addListener('remove_notification_after_select', 'on_contact_select', (contact:any) => {
      this.notificationChannel.markAsRead(contact.group.id);
    });
    this.notificationChannel.subscribe();
  }

  sendMessage(message:any, file?:any, option:any = {}) {
    if (option.groupId) {
      this.chanel.sendMessage(option.groupId, message, file);
    } else {
      let item = this.storage.find('contact_select');
      if (item && item.value && (message || file)) {
        this.chanel.sendMessage(item.value.group.id, message, file);
      }
    }
  }

  addMessage(groupId:any, res:any) {
    let item = this.storage.find('chat_messages_group_' + groupId);
    item.value.data.push(res);

    this.storage.save('current_chat_messages', item);
  }

  uploadFiles(files:any) {
    let groupId = this.storage.find('contact_select').value.group.id;
    this.fileUploadHelper.upload(files, (event:any, file:any) => {
      let data = event.target['result'];
      this.apiBaseService.post('zone/chat/upload', {file: data, file_name: file.name}).subscribe((res:any) => {
        res.data.type = 'File';
        this.removeUploadingFile(groupId);
        this.sendMessage('', res.data, {groupId: groupId});
      });
    });
  }

  uploadPhotos(files:any) {
    let groupId = this.storage.find('contact_select').value.group.id;
    this.fileUploadHelper.upload(files, (event:any, file:any) => {
      let data = event.target['result'];
      this.apiBaseService.post('zone/social_network/photos/upload', {photo: {name: file.name, image: data}}).subscribe((res:any) => {
        res.data.type = 'Photo';
        this.removeUploadingFile(groupId);
        this.sendMessage('', res.data, {groupId: groupId});
      });
    });
  }

  createUploadingFile() {
    let item:any = this.getContactSelect();
    this.addMessage(item.value.group.id, {uploading: true});
  }

  removeUploadingFile(groupId:any) {
    let item = this.storage.find('chat_messages_group_' + groupId);
    let newValue = _.remove(item.value.data, (v:any) => {
      return v.uploading != true;
    });
    item.value.data = newValue;
    let currentGroupId = this.storage.find('contact_select').value.group.id;
    if(currentGroupId == groupId)
      this.storage.save('current_chat_messages', item);
  }
}


