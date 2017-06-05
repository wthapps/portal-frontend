import { Injectable }     from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/shared/services/user.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { StorageService } from '../../../core/shared/services/storage.service';
import { HandlerService } from '../../../core/shared/services/handler.service';
import { FileUploadHelper } from '../../../core/shared/helpers/file/file-upload.helper';
import { ChatConstant } from '../constants/chat-constant';
import { ChatCommonService } from '../../../core/shared/services/chat.common.service';
import { PhotoUploadService } from '../../../core/shared/services/photo-upload.service';
import { Observable } from 'rxjs';

declare var _: any;

@Injectable()
export class ChatService {
  public fileUploadHelper: any;
  public constant: any;

  constructor(public storage: StorageService,
              public apiBaseService: ApiBaseService,
              public user: UserService,
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

  getContacts(option: any = {}) {
    let res: any = this.storage.find('chat_contacts');
    if (res && res.value && !option.forceFromApi) {
      return res;
    } else {
      this.apiBaseService.get('zone/chat/contacts').subscribe(
        (res: any) => {
          this.storage.save('chat_contacts', res);
          this.chatCommonService.setRecentContacts();
          this.chatCommonService.setFavouriteContacts();
          this.chatCommonService.setHistoryContacts();
          this.setDefaultSelectContact();
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
    // return this.storage.find('chat_history_contacts');
    return this.storage.find('chat_contacts');
  }

  addContact(ids: any, text?: any) {
    this.apiBaseService.post('zone/chat/create_contact', {user_id: ids, text: text}).subscribe(
      (res: any) => {
        this.updateConversationBroadcast(res.data.group_id);
      }
    );
  }

  cancelContact(contact: any) {
    console.log(contact);
    this.apiBaseService.post('zone/chat/contact/cancel', {group_id: contact.group_id}).subscribe(
      (res: any) => {

      }
    );
  }

  setDefaultSelectContact() {
    let res: any = this.storage.find('chat_contacts');
    if (res && res.value && res.value.data[0]) {
      this.storage.save('contact_select', res.value.data[0]);
      this.handler.triggerEvent('on_default_contact_select', res.value.data[0]);
    }
  }

  selectContact(contact: any) {
    this.storage.save('contact_select', contact);
    this.handler.triggerEvent('on_contact_select', contact);
  }

  selectContactByPartnerId(id: any) {
    let conversations: any = this.storage.find('chat_contacts').value;
    let contact: any = _.find(conversations.data, {'partner_id': id});
    if (contact) {
      this.selectContact(contact);
      this.router.navigate([`${this.constant.conversationUrl}/${contact.id}`]);
    }
  }

  getContactByPartnerId(id: any) {
    let conversations: any = this.storage.find('chat_contacts').value;
    return _.find(conversations.data, {'partner_id': id});
  }

  getContactSelect() {
    return this.storage.find('contact_select');
  }

  getFriends() {
    return this.apiBaseService.get('zone/chat/friends');
  }

  getMessages(groupId: number) {
    let item: any = this.storage.find('chat_messages_group_' + groupId);
    if (item && item.value) {
      this.storage.save('current_chat_messages', item.value);
    } else {
      this.apiBaseService.get('zone/chat/messages/' + groupId).subscribe(
        (res: any) => {
          this.storage.save('chat_messages_group_' + groupId, res);
          this.storage.save('current_chat_messages', res);
        }
      );
    }
  }

  getCurrentMessages() {
    this.handler.addListener('get_messages_after_select', 'on_contact_select', (contact: any) => {
      this.getMessages(contact.group_json.id);
      if (contact.history) {
        this.updateHistory(contact);
      }
    });
    return this.storage.find('current_chat_messages');
  }

  isExistingData(key: string) {
    let data = this.storage.find(key);
    if (data == null) return false;
    return true;
  }

  setValue(key: string, data: any) {
    this.storage.save(key, data);
  }

  getValue(key: string) {
    return this.storage.find(key);
  }

  getLatestGroupId(): any {
    let recentContacts = this.storage.find('chat_recent_contacts');
    return _.map(recentContacts.value, 'group_id')[0];
  }

  getLatestConversation(groupId: number) {
    return this.apiBaseService.get('zone/chat/messages/' + groupId);
  }


  subscribeChanel() {
    this.handler.addListener('subscribe_chanel_after_select', 'on_contact_select', (contact: any) => {
      // this.chanel.subscribe(contact.group_json.id);
    });
  }

  subscribeNotification() {
    this.handler.addListener('remove_notification_after_select', 'on_contact_select', (contact: any) => {
      this.markAsRead(contact.group_json.id);
    });
  }

  sendMessage(groupId: any, data: any, option: any = {}, callback?: any) {
    this.apiBaseService.post('zone/chat/message', {group_id: groupId, data: data}).subscribe((res: any) => {
      if (callback) {
        callback(res);
      }
    });
  }

  sendTextMessage(message: any, option: any = {}, callback?: any) {
    let item = this.storage.find('contact_select');
    if (item && item.value && message) {
      let item = this.storage.find('contact_select');
      this.sendMessage(item.value.group_json.id, {message: message, type: 'text'}, option, callback);
    }
  }

  updateMessage(conversationId: any, message: any): Observable<any> {
    return this.apiBaseService.put(`zone/chat/conversations/${conversationId}/messages`, {message: message});
  }

  uploadFiles(files: any) {
    let groupId = this.storage.find('contact_select').value.group_json.id;
    this.fileUploadHelper.upload(files, (event: any, file: any) => {
      let data = event.target['result'];
      this.apiBaseService.post('zone/chat/upload', {file: data, file_name: file.name}).subscribe((res: any) => {
        this.removeUploadingFile(groupId);
        this.sendMessage(groupId, {type: 'file', id: res.data.id, object: 'File'});
      });
    });
  }

  uploadPhotos(files: any) {
    let groupId = this.storage.find('contact_select').value.group_json.id;
    this.fileUploadHelper.upload(files, (event: any, file: any) => {
      let result = this.photoUploadService.uploadPhotos([file]).take(1)
        .subscribe((res: any) => {
          this.removeUploadingFile(groupId);
          this.sendMessage(groupId, {type: 'file', id: res.data.id, object: 'Photo'});
        }, (error: any) => {
          console.log('Error uploading photos in chat service', error);
        });
    });
  }

  uploadPhotoOnWeb(photo: any) {
    let groupId = this.storage.find('contact_select').value.group_json.id;
    this.sendMessage(groupId, {type: 'file', id: photo.id, object: 'Photo'});
  }

  createUploadingFile() {
    let item: any = this.getContactSelect();
    this.chatCommonService.addMessage(item.value.group_json.id, {message_type: 'file_tmp'});
  }

  removeUploadingFile(groupId: any) {
    let item = this.storage.find('chat_messages_group_' + groupId);
    let newValue = _.remove(item.value.data, (v: any) => {
      return v.message_type != 'file_tmp';
    });
    item.value.data = newValue;
    let currentGroupId = this.storage.find('contact_select').value.group_json.id;
    if (currentGroupId == groupId)
      this.storage.save('current_chat_messages', item);
  }

  getUsersOnline() {
    return this.storage.find('users_online');
  }

  loadMoreMessages() {
    // TODO Optimize load times
    let n: any = this.storage.find('number_message').value;
    let currentMessages: any = this.storage.find('current_chat_messages').value.data;
    let page: any = Math.floor(currentMessages.length / n) + 1;
    let body: any = {page: page};
    let groupId: any = this.storage.find('contact_select').value.group_json.id;
    this.apiBaseService.get('zone/chat/messages/' + groupId, body).subscribe(
      (res: any) => {
        let newMessages: any = _.concat(currentMessages, res.data);
        newMessages = _.uniqBy(newMessages, 'id');
        newMessages = _.orderBy(newMessages, ['id'], ['asc']);
        res.data = newMessages;
        this.storage.save('chat_messages_group_' + groupId, res);
        this.storage.save('current_chat_messages', res);
      }
    );
  }

  addGroupUserFavorite(contact:any) {
    let body: any = {favourite: !contact.favourite};
    this.updateGroupUser(contact.group_id, body);
    contact.favourite = !contact.favourite;
  }

  addGroupUserBlackList(userId: any) {
    this.apiBaseService.post('users/users_blacklist', {user_id: userId, module_name: "chat"}).subscribe((res: any) => {
      //
    });
  }

  updateNotification(contact: any, data: any) {
    this.storage.find('contact_select').value.notification = !this.storage.find('contact_select').value.notification;
    this.updateGroupUser(contact.group_id, data);
  }

  deleteContact(contact: any) {
    this.updateGroupUser(contact.group_id, {deleted: true});
  }

  updateDisplay(contact: any, data: any) {
    this.updateGroupUser(contact.group_id, data, (res: any) => {
      this.updateDisplayNotification(contact.group_json.id);
    });
  }

  updateHistory(contact: any) {
    this.updateGroupUser(contact.group_id, {history: false});
  }

  leaveConversation(contact: any) {
    this.updateGroupUser(contact.group_id, {leave: true}, (res: any) => {
      this.updateConversationBroadcast(contact.group_id);
    });
  }

  removeFromConversation(contact: any, userId: any) {
    this.updateGroupUser(contact.group_id, {leave: true, user_id: userId}, (res: any) => {
      this.updateConversationBroadcast(contact.group_id);
    });
  }

  updateGroupUser(groupId: any, data: any, callback?: any) {
    this.apiBaseService.put('zone/chat/group_user/' + groupId, data).subscribe(
      (res: any) => {
        this.storage.save('chat_contacts', res);
        this.chatCommonService.updateAll();
        if (callback) {
          callback(res);
        }
      }
    );
  }

  addMembersGroup(friends: any, group?: any) {
    let groupId: any = null;
    if (group) {
      groupId = group;
    } else {
      groupId = this.storage.find('contact_select').value.group_json.id;
    }
    let body = {friends: friends};
    this.apiBaseService.put('zone/chat/group/' + groupId, body).subscribe(
      (res: any) => {
        this.updateConversationBroadcast(groupId);
      }
    );
  }

  addMemberGroups(friendId: any, groupIds: any) {
    for (let groupId of groupIds) {
      this.addMembersGroup([friendId], groupId);
    }
  }

  getSetting() {
    return this.apiBaseService.get('zone/chat/setting');
  }

  updateSetting(body: any) {
    return this.apiBaseService.post('zone/chat/update_setting', body);
  }

  restoreSetting() {
    return this.apiBaseService.post('zone/chat/restore_setting');
  }

  acceptRequest(contact: any) {
    this.updateGroupUser(contact.group_id, {accept_friend: true}, (res: any) => {
      contact.active = true;
    });
  }

  declineRequest(contact: any, setDefaultOnSelect: boolean = true) {
    this.updateGroupUser(contact.group_id, {status: "decline"}, (res: any) => {
      if (setDefaultOnSelect) {
        this.setDefaultSelectContact();
      }
    });
  }

  searchUsers(name: any) {
    return this.apiBaseService.post('users/search', {q: `name:${name}`});
  }

  shareContact(ids: any) {
    let item = this.storage.find('contact_select');
    this.apiBaseService.post('zone/chat/contact/share', {
      group_id: item.value.group_json.id,
      share_user_ids: ids
    }).subscribe((res: any) => {

    });
    for (let i = 0; i < ids.length; i++) {
      if (item && item.value) {
        // this.chanel.sendContactMessage(item.value.group_json.id, '', ids[i]);
        this.sendMessage(item.value.group_json.id, {message: '', type: 'contact', contact: ids[i]});
        if (item.value.history) {
          this.updateHistory(item.value);
        }
      }
    }
  }

  markAsRead(groupId: any) {
    this.apiBaseService.post('zone/chat/notification/mark_as_read', {group_id: groupId}).subscribe((res: any) => {
      let item = this.storage.find('chat_contacts');
      if (item && item.value) {
        let contact = _.find(item.value.data, (contact: any) => {
          if (contact.group_json.id == groupId) return contact;
        });
        if (contact) {
          contact.notification_count = 0;
        }
      }
    });
  }

  updateDisplayNotification(groupId: any) {
    this.apiBaseService.post('zone/chat/notification/broadcard_group_user_display', {group_id: groupId}).subscribe((res: any) => {
      // console.log(res);
    });
  }

  updateConversationBroadcast(groupId: any) {
    this.apiBaseService.post('zone/chat/notification/broadcard_contact', {group_id: groupId}).subscribe((res: any) => {
      // console.log(res);
    });
  }

  getOwnUserProfile() {
    return this.user.profile;
  }
}


