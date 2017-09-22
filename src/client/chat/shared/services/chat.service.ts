import { Injectable }     from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { UserService } from '../../../core/shared/services/user.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { StorageService } from '../../../core/shared/services/storage.service';
import { HandlerService } from '../../../core/shared/services/handler.service';
import { FileUploadHelper } from '../../../core/shared/helpers/file/file-upload.helper';
import { ChatConstant } from '../../../core/shared/constant/chat-constant';
import { ChatCommonService } from '../../../core/shared/services/chat.common.service';
import { PhotoUploadService } from '../../../core/shared/services/photo-upload.service';
import { ChatContactService } from './chat-contact.service';
import { Message } from '../models/message.model';
import { GenericFile } from '../../../core/shared/models/generic-file.model';
import { GenericFileService } from '../../../core/shared/services/generic-file.service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { _chat } from '../utils/chat.functions';


declare var _: any;

@Injectable()
export class ChatService {
  public fileUploadHelper: FileUploadHelper;
  public constant: any;

  constructor(public storage: StorageService,
              public apiBaseService: ApiBaseService,
              public user: UserService,
              public chatContactService: ChatContactService,
              public chatCommonService: ChatCommonService,
              public photoUploadService: PhotoUploadService,
              public commonEventService: CommonEventService,
              public router: Router,
              public handler: HandlerService,
              private fileService: GenericFileService) {
    // =============================
    this.storage.save('chat_conversations', null);
    this.storage.save('chat_recent_conversations', null);
    this.storage.save('chat_favourite_conversations', null);
    this.storage.save('chat_history_conversations', null);
    this.storage.save('conversation_select', null);
    this.storage.save('current_chat_messages', null);
    this.storage.save('users_online', []);
    this.storage.save('number_message', 20);
    this.fileUploadHelper = new FileUploadHelper();
    this.constant = ChatConstant;
  }

  getConversations(option: any = {}) {
    let res: any = this.storage.find('chat_conversations');
    if (res && res.value && !option.forceFromApi) {
      return res;
    } else {
      this.apiBaseService.get('zone/chat/contacts').subscribe(
        (res: any) => {
          this.storage.save('chat_conversations', res);
          this.chatCommonService.setRecentConversations();
          this.chatCommonService.setFavouriteConversations();
          this.chatCommonService.setHistoryConversations();
          this.chatCommonService.setDefaultSelectContact();
        }
      );
      return res;
    }
  }

  getUserContacts(option: any = {}) {
    return this.apiBaseService.get('contact/contacts/internal_contacts');
  }

  getRecentConversations() {
    return this.storage.find('chat_recent_conversations');
  }

  getFavouriteConversations() {
    return this.storage.find('chat_favourite_conversations');
  }

  getHistoryConversations() {
    // return this.storage.find('chat_history_conversations');
    return this.storage.find('chat_conversations');
  }

  selectContact(contact: any) {
    this.storage.save('conversation_select', contact);
    this.handler.triggerEvent('on_conversation_select', contact);
  }

  subscribeNotification() {
    this.handler.addListener('remove_notification_after_select', 'on_conversation_select', (contact: any) => {
      this.markAsRead(contact.group_json.id);
    });
  }

  selectContactByPartnerId(id: any) {
    let conversations: any = this.storage.find('chat_conversations').value;
    let contact: any = _.find(conversations.data, {'partner_id': id});
    if (contact) {
      this.selectContact(contact);
      this.router.navigate([`${this.constant.conversationUrl}/${contact.id}`]);
    }
  }

  getContactByPartnerId(id: any) {
    let conversations: any = this.storage.find('chat_conversations').value;
    return _.find(conversations.data, {'partner_id': id});
  }

  getContactSelect() {
    return this.storage.find('conversation_select');
  }

  getMessages(groupId: number) {
    let item: any = this.storage.find('chat_messages_group_' + groupId);
    if (item && item.value) {
      this.storage.save('current_chat_messages', item.value);
    } else {
      //
      this.apiBaseService.get('zone/chat/message/' + groupId).subscribe(
        (res: any) => {
          this.storage.save('chat_messages_group_' + groupId, res);
          this.storage.save('current_chat_messages', res);
        }
      );
    }
  }

  getCurrentMessages() {
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
    let recentContacts = this.storage.find('chat_recent_conversations');
    return _.map(recentContacts.value, 'group_id')[0];
  }

  getLatestConversation(groupId: number) {
    return this.apiBaseService.get('zone/chat/message/' + groupId);
  }

  sendMessage(groupId: any, data: any, option: any = {}, callback?: any) {
    this.apiBaseService.post('zone/chat/message', {group_id: groupId, data: data}).subscribe((res: any) => {
      if (callback) {
        callback(res);
      }
    });
  }

  sendTextMessage(message: any, option: any = {}, callback?: any) {
    let item = this.storage.find('conversation_select');
    if (item && item.value && message) {
      let item = this.storage.find('conversation_select');
      this.sendMessage(item.value.group_json.id, {message: message, type: 'text'}, option, callback);
    }
  }

  updateMessage(conversationId: any, message: any): Observable<any> {
    return this.apiBaseService.put(`zone/chat/conversations/${conversationId}/messages`, {message: message});
  }

  uploadFiles(files: any, parent?: any) {
    for (let i = 0; i < files.length; i++) {
      files[0].parent = {
        id: parent.id,
        uuid: '',
        type: 'Chat::Message'
      };
    }
    this.fileUploadHelper.upload(files, (event: any, file: any) => {
      let genericFile = new GenericFile({
        file: event.target['result'],
        name: file.name,
        content_type: file.type,
        parent: file.parent
      });
      // update current message and broadcast on server
      this.fileService.create(genericFile)
        .subscribe((response: any) => {
          console.log('send file successfully', response);
      });
    });
  }

  uploadPhotoOnWeb(photo: any) {
    let groupId = this.storage.find('conversation_select').value.group_json.id;
    this.sendMessage(groupId, {type: 'file', id: photo.id, object: 'Photo'});
  }

  createUploadingFile(files?: any) {
    this.fileUploadHelper.allowUpload(files, (filesAllow: any, filesNotAllow: any) => {
      let groupId = this.storage.find('conversation_select').value.group_json.id;
      let message: Message = new Message({
        message: 'Sending file.....',
        message_type: 'file',
        content_type: 'media/generic'
      });

      for (let i = 0; i < filesAllow.length; i++) {
        this.sendMessage(groupId, message, null, (response: any) => {
          this.uploadFiles([filesAllow[i]], {id: response.data.id})
        });
      }
      for (let i = 0; i < filesNotAllow.length; i++) {
        this.commonEventService.broadcast({channel: 'chatBlockMessage', payload: filesNotAllow[i]})
      }
    });
  }

  getUsersOnline() {
    return this.storage.find('users_online');
  }

  loadMoreMessages() {
    let currentMessages: any = this.storage.find('current_chat_messages').value.data;
    let page: any = parseInt(this.storage.find('current_chat_messages').value.page_metadata.page) + 1;
    let body: any = {page: page};
    let groupId: any = this.storage.find('conversation_select').value.group_json.id;
    this.apiBaseService.get('zone/chat/message/' + groupId, body).subscribe(
      (res: any) => {
        res.data = _chat.combineMessages(currentMessages, res.data);
        this.storage.save('chat_messages_group_' + groupId, res);
        this.storage.save('current_chat_messages', res);
      }
    );
  }

  searchMessages(text: any) {
    let currentMessages: any = this.storage.find('current_chat_messages').value.data;
    let page: any = parseInt(this.storage.find('current_chat_messages').value.page_metadata.page);
    let body: any = {q: "message:1"};
    let groupId: any = this.storage.find('conversation_select').value.group_json.id;

    let sequenceCall = (nextPage: any, currentPage: any): any => {
      if (nextPage == currentPage) {
        return [];
      }
      this.apiBaseService.get('zone/chat/message/' + groupId, {page: nextPage}).subscribe(
        (res: any) => {
          res.data = _chat.combineMessages(this.storage.find('current_chat_messages').value.data, res.data);
          this.storage.save('chat_messages_group_' + groupId, res);
          this.storage.save('current_chat_messages', res);
          sequenceCall(parseInt(res.page_metadata.page) + 1,  currentPage);
        }
      );
    }

    this.apiBaseService.get('zone/chat/message/' + groupId, body).subscribe(
      (res: any) => {
        res.data = _chat.combineMessages(currentMessages, res.data);
        this.storage.save('chat_messages_group_' + groupId, res);
        this.storage.save('current_chat_messages', res);
        sequenceCall(res.page_metadata.page, page);
      }
    );
  }

  addGroupUserFavorite(contact: any) {
    let body: any = {favourite: !contact.favourite};
    this.updateGroupUser(contact.group_id, body);
    contact.favourite = !contact.favourite;
  }

  addGroupUserBlackList(userId: any) {
    this.apiBaseService.post('users/users_blacklist', {user_id: userId, module_name: 'chat'}).subscribe((res: any) => {
      console.log(res);
    });
  }

  updateNotification(contact: any, data: any) {
    this.storage.find('conversation_select').value.notification = !this.storage.find('conversation_select').value.notification;
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
      this.chatCommonService.updateConversationBroadcast(contact.group_id);
    });
  }

  removeFromConversation(contact: any, userId: any) {
    this.updateGroupUser(contact.group_id, {remove_from_conversation: true, user_id: userId}, (res: any) => {
      this.chatCommonService.updateConversationBroadcast(contact.group_id);
    });
  }

  updateGroupUser(groupId: any, data: any, callback?: any) {
    this.apiBaseService.put('zone/chat/group_user/' + groupId, data).subscribe(
      (res: any) => {
        this.storage.save('chat_conversations', res);
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
      groupId = this.storage.find('conversation_select').value.group_json.id;
    }
    let body = {friends: friends};
    this.apiBaseService.put('zone/chat/group/' + groupId, body).subscribe(
      (res: any) => {
        this.chatCommonService.updateConversationBroadcast(groupId);
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
    this.updateGroupUser(contact.group_id, {status: 'decline'}, (res: any) => {
      if (setDefaultOnSelect) {
        this.chatCommonService.setDefaultSelectContact();
      }
    });
  }

  searchUsers(name: any) {
    return this.apiBaseService.post('users/search', {q: `name:${name}`});
  }

  shareContact(ids: any) {
    let item = this.storage.find('conversation_select');
    this.apiBaseService.post('zone/chat/contact/share', {
      group_id: item.value.group_json.id,
      share_user_ids: ids
    }).subscribe((res: any) => {
      console.log(res);
    });
    for (let i = 0; i < ids.length; i++) {
      if (item && item.value) {
        this.sendMessage(item.value.group_json.id, {message: '', type: 'contact', contact: ids[i]});
        if (item.value.history) {
          this.updateHistory(item.value);
        }
      }
    }
  }

  markAsRead(groupId: any) {
    this.apiBaseService.post('zone/chat/notification/mark_as_read', {group_id: groupId}).subscribe((res: any) => {
      let item = this.storage.find('chat_conversations');
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

  getOwnUserProfile() {
    return this.user.profile;
  }

  updatePhotoMessage(messageId: any, groupId: any, fileJson: any): Promise<any> {
    return this.apiBaseService.put('zone/chat/message/' + messageId, {
      group_id: groupId,
      file_json: fileJson,
      id: messageId
    }).toPromise()
      .then((res: any) => {
        console.log('updatePhotoMessage: ', res);
        return res;
      });
  }
}
