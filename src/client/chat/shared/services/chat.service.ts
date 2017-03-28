import { Injectable }     from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/shared/services/user.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { StorageService } from '../../../core/shared/services/storage.service';
import { HandlerService } from '../../../core/shared/services/handler.service';
import { FileUploadHelper } from '../../../core/shared/helpers/file/file-upload.helper';
import { ChatConstant } from '../constants/chat-constant';
import { ChatChannelService } from '../channels/chat-channel.service';
import { ChatNotificationChannelService } from '../channels/chat-notification-channel.service';
import { ChatCommonService } from './chat.common.service';
import { PhotoUploadService } from '../../../core/shared/services/photo-upload.service';

declare var _:any;

@Injectable()
export class ChatService {
  public fileUploadHelper:any;
  public constant:any;

  constructor(public storage: StorageService,
              public apiBaseService: ApiBaseService,
              public user: UserService,
              public chanel: ChatChannelService,
              public notificationChannel: ChatNotificationChannelService,
              public chatCommonService: ChatCommonService,
              public photoUploadService: PhotoUploadService,
              public router: Router,
              public handler: HandlerService) {
    // =============================
    this.storage.save('chat_contacts', null);
    this.storage.save('chat_recent_contacts', null);
    this.storage.save('chat_favourite_contacts', null);
    this.storage.save('chat_history_contacts', null);
    this.storage.save('contact_select', null);
    this.storage.save('current_chat_messages', null);
    this.storage.save('users_online', []);
    this.storage.save('number_message', 10);
    this.fileUploadHelper = new FileUploadHelper();
    this.constant = ChatConstant;
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
          this.chatCommonService.setRecentContacts();
          this.chatCommonService.setFavouriteContacts();
          this.chatCommonService.setHistoryContacts();
        }
      );
      return res;
    }
  }

  getRecentContacts() {
    return this.storage.find('chat_recent_contacts');
  }

  getFavouriteContacts() {
    return this.storage.find('chat_favourite_contacts');
  }

  getHistoryContacts() {
    return this.storage.find('chat_history_contacts');
  }

  addContact(ids:any, text?:any) {
    this.apiBaseService.post('zone/chat/create_contact', {user_id: ids, text:text}).subscribe(
      (res:any) => {
        this.notificationChannel.addedContactNotification(res.data.group_json.id);
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
      this.getMessages(contact.group_json.id);
    });
    return this.storage.find('current_chat_messages');
  }

  subscribeChanel() {
    this.handler.addListener('subscribe_chanel_after_select', 'on_contact_select', (contact:any) => {
      this.chanel.subscribe(contact.group_json.id);
    });
  }

  subscribeNotification() {
    this.handler.addListener('remove_notification_after_select', 'on_contact_select', (contact:any) => {
      this.notificationChannel.markAsRead(contact.group_json.id);
    });
    this.notificationChannel.subscribe();
  }

  sendMessage(groupId:any, data:any, option:any = {}, callback?:any) {
    this.apiBaseService.post('zone/chat/message', {group_id: groupId, data: data}).subscribe((res:any) => {
      console.log(res);
    });
  }

  sendTextMessage(message:any, option:any = {}, callback?:any) {
    let item = this.storage.find('contact_select');
    if (item && item.value && message) {
      let item = this.storage.find('contact_select');
      this.sendMessage(item.value.group_json.id, {message: message, type: "text"});
    }
  }

  uploadFiles(files:any) {
    let groupId = this.storage.find('contact_select').value.group_json.id;
    this.fileUploadHelper.upload(files, (event:any, file:any) => {
      let data = event.target['result'];
      this.apiBaseService.post('zone/chat/upload', {file: data, file_name: file.name}).subscribe((res:any) => {
        this.removeUploadingFile(groupId);
        this.sendMessage(groupId, {type: "file", id:res.data.id, object: "File"});
      });
    });
  }

  uploadPhotos(files:any) {
    let groupId = this.storage.find('contact_select').value.group_json.id;
    this.fileUploadHelper.upload(files, (event:any, file:any) => {
      this.photoUploadService.uploadPhotos(file)
        .then((data: any) => {
          this.removeUploadingFile(groupId);
          this.sendMessage(groupId, {type: "file", id: data.id, object: "Photo"});
        })
        .catch((error: any) => {
          console.error('Error uploading photos in chat service', error);
        });
    });
  }

  uploadPhotoOnWeb(photo:any) {
    let groupId = this.storage.find('contact_select').value.group_json.id;
    this.sendMessage(groupId, {type: "file", id: photo.id, object: "Photo"});
  }

  createUploadingFile() {
    let item:any = this.getContactSelect();
    this.chatCommonService.addMessage(item.value.group_json.id, {message_type: 'file_tmp'});
  }

  removeUploadingFile(groupId:any) {
    let item = this.storage.find('chat_messages_group_' + groupId);
    let newValue = _.remove(item.value.data, (v:any) => {
      return v.message_type != 'file_tmp';
    });
    item.value.data = newValue;
    let currentGroupId = this.storage.find('contact_select').value.group_json.id;
    if(currentGroupId == groupId)
      this.storage.save('current_chat_messages', item);
  }

  getUsersOnline() {
    return this.storage.find('users_online');
  }

  loadMoreMessages() {
    // TODO Optimize load times
    let n:any = this.storage.find('number_message').value;
    let currentMessages:any = this.storage.find('current_chat_messages').value.data;
    let page:any = Math.floor(currentMessages.length/n)+1;
    let body:any = {page: page};
    let groupId:any = this.storage.find('contact_select').value.group_json.id;
    this.apiBaseService.get('zone/chat/messages/' + groupId, body).subscribe(
      (res:any) => {
        let newMessages:any = _.concat(currentMessages, res.data);
        newMessages = _.uniqBy(newMessages, 'id');
        newMessages = _.orderBy(newMessages, ['id'], ['asc']);
        res.data = newMessages;
        this.storage.save('chat_messages_group_' + groupId, res);
        this.storage.save('current_chat_messages', res);
      }
    );
  }

  addGroupUserFavorite() {
    let groupUserId:any = this.storage.find('contact_select').value.id;
    let favourite:any = !this.storage.find('contact_select').value.favourite;
    let body:any = {favourite: favourite};
    this.updateGroupUser(groupUserId, body);
    this.storage.find('contact_select').value.favourite = !this.storage.find('contact_select').value.favourite;
  }

  addGroupUserBlackList(contact:any) {
    let groupUserId:any = contact.id;
    let body:any = {black_list: true};
    this.updateGroupUser(groupUserId, body);
  }

  removeBlackList(contact:any) {
    let groupUserId:any = contact.id;
    let body:any = {black_list: false};
    this.updateGroupUser(groupUserId, body);
  }

  updateNotification(contact:any, data:any) {
    this.storage.find('contact_select').value.notification = !this.storage.find('contact_select').value.notification;
    this.updateGroupUser(contact.id, data);
  }

  deleteContact(contact:any) {
    this.updateGroupUser(contact.id, {deleted: true});
  }

  updateDisplay(contact:any, data:any) {
    this.updateGroupUser(contact.id, data, (res:any) => {
      this.notificationChannel.updateDisplayNotification(contact.group_json.id);
    });
  }

  updateHistory(contact:any) {
    this.updateGroupUser(contact.id, {history: false});
  }

  leaveConversation(contact:any) {
    this.updateGroupUser(contact.id, {leave: true});
  }

  updateGroupUser(groupUserId:any, data:any, callback?:any) {
    this.apiBaseService.put('zone/chat/group_user/' + groupUserId, data).subscribe(
      (res:any) => {
        this.storage.save('chat_contacts', res);
        this.chatCommonService.updateAll();
        if (callback) {
          callback(res);
        }
      }
    );
  }

  addMembersGroup(friends:any, group?:any) {
    let groupId:any = null;
    if(group) {
      groupId = group;
    } else {
      groupId = this.storage.find('contact_select').value.group_json.id;
    }
    let body = {friends: friends};
    this.apiBaseService.put('zone/chat/group/' + groupId, body).subscribe(
      (res:any) => {
        this.notificationChannel.addedContactNotification(groupId);
      }
    );
  }

  addMemberGroups(friendId:any, groupIds:any) {
    for(let groupId of groupIds) {
      this.addMembersGroup([friendId], groupId);
    }
  }

  getSetting() {
    return this.apiBaseService.get('zone/chat/setting');
  }

  updateSetting(body:any) {
    return this.apiBaseService.post('zone/chat/update_setting', body);
  }

  restoreSetting() {
    return this.apiBaseService.post('zone/chat/restore_setting');
  }

  acceptRequest(contact:any) {
    this.updateGroupUser(contact.id, {active: true}, (res:any) => {
      contact.active = true;
    });
  }

  searchUsers(name:any) {
    return this.apiBaseService.post('users/search', {text: name});
  }

  shareContact(ids:any) {
    for(let i=0; i < ids.length; i++) {
      let item = this.storage.find('contact_select');
      if (item && item.value) {
        this.chanel.sendContactMessage(item.value.group_json.id, '', ids[i]);
        if (item.value.history) {
          this.updateHistory(item.value);
        }
      }
    }
  }
}


