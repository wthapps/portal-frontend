import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { ChatContactService } from './chat-contact.service';
import { Message } from '../models/message.model';
import { _chat } from '../utils/chat.functions';
import {
  ApiBaseService,
  ChatCommonService,
  CommonEventService,
  GenericFileService,
  HandlerService,
  PhotoUploadService,
  StorageService,
  UserService
} from '@wth/shared/services';
import { ChatConstant } from '@wth/shared/constant';
import { GenericFile } from '@wth/shared/shared/models/generic-file.model';
import { FileReaderUtil } from '@shared/shared/utils/file/file-reader.util';
import { FileUploaderService } from '@shared/services/file/file-uploader.service';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';
import { ConversationApiCommands } from '@shared/commands/chat/coversation-commands';
import { Store } from '@ngrx/store';
import * as fromConversations from './../../../core/store/chat/conversations.reducer';
import * as fromConversationsUsers from './../../../core/store/chat/conversations_users.reducer';

declare var _: any;

@Injectable()
export class ChatService {
  public constant: any;

  constructor(
    public storage: StorageService,
    public apiBaseService: ApiBaseService,
    public userService: UserService,
    public chatContactService: ChatContactService,
    public chatCommonService: ChatCommonService,
    public photoUploadService: PhotoUploadService,
    public commonEventService: CommonEventService,
    public router: Router,
    public store: Store<any>,
    public handler: HandlerService,
    public fileUploaderService: FileUploaderService,
    private fileService: GenericFileService
  ) {
    // =============================
    this.storage.save('chat_conversations', null);
    this.storage.save('chat_recent_conversations', null);
    this.storage.save('chat_favourite_conversations', null);
    this.storage.save('chat_history_conversations', null);
    this.storage.save('conversation_select', null);
    this.storage.save('current_chat_messages', null);
    this.storage.save('users_online', []);
    this.storage.save('number_message', 20);
    this.constant = ChatConstant;
  }

  initalize() {
    this.subscribeNotification();
    // Init get data
    this.getConversationsAsync().subscribe();
    // this.apiBaseService
    //   .addCommand(ConversationApiCommands.getConversations())
    //   .subscribe(res => {
    //     this.store.dispatch({
    //       type: fromConversations.SET_CHAT_CONVERSATIONS,
    //       payload: res.data
    //     });
    //     this.store.dispatch({
    //       type: fromConversationsUsers.SET_CHAT_CONVERSATIONS_USERS,
    //       payload: res.included
    //     });
    //   });
  }

  getConversations(option: any = {}) {
    let res: any = this.storage.find('chat_conversations');
    if (res && res.value && !option.forceFromApi) {
      return res;
    } else {
      this.apiBaseService.get('zone/chat/contacts').subscribe((res: any) => {
        this.storage.save('chat_conversations', res);
        this.chatCommonService.setRecentConversations();
        this.chatCommonService.setFavouriteConversations();
        this.chatCommonService.setHistoryConversations();
        this.chatCommonService.setDefaultSelectContact();
      });
      return res;
    }
  }

  getConversationsAsync(option: any = {}) {
    return new Observable((observer: any) => {
      const res: any = this.storage.find('chat_conversations');
      if (res && res.value && !option.forceFromApi) {
        observer.next(res);
        observer.complete();
      } else {
        this.apiBaseService.get('zone/chat/contacts').subscribe((res: any) => {
          this.storage.save('chat_conversations', res);
          this.chatCommonService.setRecentConversations();
          this.chatCommonService.setFavouriteConversations();
          this.chatCommonService.setHistoryConversations();
          observer.next(this.storage.find('chat_conversations'));
          observer.complete();
        });
      }
    });
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
    // this.storage.save('conversation_select', contact);
    this.handler.triggerEvent('on_conversation_select', contact);
  }

  subscribeNotification() {
    this.handler.addListener(
      'remove_notification_after_select',
      'on_conversation_select',
      (contact: any) => {
        if (contact.notification_count > 0)
          this.markAsRead(contact.group_json.id);
      }
    );
  }

  selectContactByPartnerId(id: any) {
    let conversations: any = this.storage.find('chat_conversations').value;
    let contact: any = _.find(conversations.data, { partner_id: id });
    if (contact) {
      this.selectContact(contact);
      this.router.navigate([`${this.constant.conversationUrl}/${contact.id}`]);
    }
  }

  getContactByPartnerId(id: any) {
    let conversations: any = this.storage.find('chat_conversations').value;
    return _.find(conversations.data, { partner_id: id });
  }

  getContactSelect() {
    return this.storage.find('conversation_select');
  }

  getMessages(groupId: number, options: any = {}) {
    let item: any = this.storage.find('chat_messages_group_' + groupId);
    if (item && item.value) {
      if (this.storage.find('conversation_select').value.group_id == groupId) {
        this.storage.save('current_chat_messages', item.value);
      }
    } else {
      this.storage.save('current_chat_messages', null);
      this.apiBaseService
        .get('zone/chat/message/' + groupId, options)
        .subscribe((res: any) => {
          this.storage.save('chat_messages_group_' + groupId, res);
          if (
            this.storage.find('conversation_select').value &&
            this.storage.find('conversation_select').value.group_id == groupId
          ) {
            this.storage.save('current_chat_messages', res);
          }
        });
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
    this.apiBaseService
      .post('zone/chat/message', { group_id: groupId, data: data })
      .subscribe((res: any) => {
        if (callback) {
          callback(res);
        }
      });
  }

  sendTextMessage(message: any, option: any = {}, callback?: any) {
    let item = this.storage.find('conversation_select');
    if (item && item.value && message) {
      let item = this.storage.find('conversation_select');
      this.sendMessage(
        item.value.group_json.id,
        { message: message, type: 'text' },
        option,
        callback
      );
    }
  }

  updateMessage(conversationId: any, message: any): Observable<any> {
    return this.apiBaseService.put(
      `zone/chat/conversations/${conversationId}/messages`,
      { message: message }
    );
  }

  uploadPhotoOnWeb(photo: any) {
    let groupId = this.storage.find('conversation_select').value.group_json.id;
    this.sendMessage(groupId, { type: 'file', id: photo.id, object: 'Photo' });
  }

  createUploadingFile(files?: any) {
    let filesAddedPolicy = FileUploadPolicy.allowMultiple(files);
    filesAddedPolicy.forEach((file: any) => {
      let groupId = this.storage.find('conversation_select').value.group_json
        .id;
      let message: Message = new Message({
        message: 'Sending file.....',
        message_type: 'file',
        content_type: 'media/generic'
      });
      if (file.allow) {
        this.sendMessage(groupId, message, null, (response: any) => {
          file.parent = {
            id: response.data.id,
            uuid: '',
            type: 'Chat::Message'
          };
          this.fileUploaderService
            .uploadGenericFile(file)
            .subscribe((res: any) =>
              console.log('send file successfully', res)
            );
        });
      }
    });
    let tmp = filesAddedPolicy.filter((item: any) => !item.allow);
    if (tmp && tmp.length > 0)
      this.commonEventService.broadcast({
        channel: 'LockMessage',
        payload: tmp
      });
  }

  getUsersOnline() {
    return this.storage.find('users_online');
  }

  loadMoreMessages(callback: any = null) {
    let current = this.storage.find('current_chat_messages').value || {};
    let currentMessages: any = current.data || [];
    let page: any = 1;
    if (current.meta) page = parseInt(current.meta.page) + 1;
    let body: any = { page: page };
    let groupId: any = this.storage.find('conversation_select').value.group_json
      .id;
    this.apiBaseService
      .get('zone/chat/message/' + groupId, body)
      .subscribe((res: any) => {
        res.data = _chat.combineMessages(currentMessages, res.data);
        this.storage.save('chat_messages_group_' + groupId, res);
        if (
          this.storage.find('conversation_select').value.group_id == groupId
        ) {
          this.storage.save('current_chat_messages', res);
        }
        if (callback) callback();
      });
  }

  searchMessages(text: any) {
    let currentMessages: any = this.storage.find('current_chat_messages').value
      .data;
    let page: any = parseInt(
      this.storage.find('current_chat_messages').value.meta.page
    );
    let body: any = { q: 'message:1' };
    let groupId: any = this.storage.find('conversation_select').value.group_json
      .id;

    let sequenceCall = (nextPage: any, currentPage: any): any => {
      if (nextPage == currentPage) {
        return [];
      }
      this.apiBaseService
        .get('zone/chat/message/' + groupId, { page: nextPage })
        .subscribe((res: any) => {
          res.data = _chat.combineMessages(
            this.storage.find('current_chat_messages').value.data,
            res.data
          );
          this.storage.save('chat_messages_group_' + groupId, res);
          this.storage.save('current_chat_messages', res);
          sequenceCall(parseInt(res.meta.page) + 1, currentPage);
        });
    };

    this.apiBaseService
      .get('zone/chat/message/' + groupId, body)
      .subscribe((res: any) => {
        res.data = _chat.combineMessages(currentMessages, res.data);
        this.storage.save('chat_messages_group_' + groupId, res);
        this.storage.save('current_chat_messages', res);
        sequenceCall(res.meta.page, page);
      });
  }

  addGroupUserFavorite(contact: any) {
    let body: any = { favourite: !contact.favourite };
    this.updateGroupUser(contact.group_id, body);
    contact.favourite = !contact.favourite;
  }

  addGroupUserBlackList(userId: any) {
    this.apiBaseService
      .post('users/users_blacklist', { user_id: userId, module_name: 'chat' })
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  updateNotification(contact: any, data: any) {
    this.storage.find(
      'conversation_select'
    ).value.notification = !this.storage.find('conversation_select').value
      .notification;
    this.updateGroupUser(contact.group_id, data);
  }

  deleteContact(contact: any) {
    this.updateGroupUser(contact.group_id, { deleted: true });
  }

  updateDisplay(contact: any, data: any) {
    this.updateGroupUser(contact.group_id, data)
      .then((res: any) => {
      return this.updateDisplayNotification(contact.group_json.id);
    });
  }

  updateHistory(contact: any) {
    this.updateGroupUser(contact.group_id, { history: false });
  }

  leaveConversation(contact: any): Promise<any> {
    return this.updateGroupUser(contact.group_id, { leave: true })
      .then((res: any) => {
      this.chatCommonService.updateConversationBroadcast(contact.group_id);
    });
  }

  removeFromConversation(contact: any, userId: any) {
    this.updateGroupUser(
      contact.group_id,
      { remove_from_conversation: true, user_id: userId })
      .then((res: any) => {
        return this.chatCommonService.updateConversationBroadcast(contact.group_id);
      }
    );
  }

  updateGroupUser(groupId: any, data: any) {
    return this.apiBaseService
      .put('zone/chat/group_user/' + groupId, data)
      .toPromise().then((res: any) => {
        this.storage.save('chat_conversations', res);
        this.chatCommonService.updateAll();
        return res;
      });
  }

  addMembersGroup(friends: any, group?: any) {
    let groupId: any = null;
    if (group) {
      groupId = group;
    } else {
      groupId = this.storage.find('conversation_select').value.group_json.id;
    }
    let body = { friends: friends };
    this.apiBaseService
      .put('zone/chat/group/' + groupId, body)
      .subscribe((res: any) => {
        this.chatCommonService.updateConversationBroadcast(groupId);
      });
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
    this.updateGroupUser(
      contact.group_id,
      { accept_friend: true })
      .then((res: any) => {
        contact.active = true;
      }
    );
  }

  declineRequest(contact: any, setDefaultOnSelect: boolean = true) {
    this.updateGroupUser(
      contact.group_id,
      { status: 'decline' })
      .then((res: any) => {
        if (setDefaultOnSelect) {
          this.chatCommonService.setDefaultSelectContact();
        }
      }
    );
  }

  searchUsers(name: any) {
    return this.apiBaseService.post('users/search', { q: `name:${name}` });
  }

  shareContact(ids: any) {
    let item = this.storage.find('conversation_select');
    this.apiBaseService
      .post('zone/chat/contact/share', {
        group_id: item.value.group_json.id,
        share_user_ids: ids
      })
      .subscribe((res: any) => {
        console.log(res);
      });
    for (let i = 0; i < ids.length; i++) {
      if (item && item.value) {
        this.sendMessage(item.value.group_json.id, {
          message: '',
          type: 'contact',
          contact: ids[i]
        });
        if (item.value.history) {
          this.updateHistory(item.value);
        }
      }
    }
  }

  markAsRead(groupId: any) {
    this.apiBaseService
      .post('zone/chat/notification/mark_as_read', { id: groupId })
      .subscribe((res: any) => {
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

  updateDisplayNotification(groupId: any): Promise<any> {
    return this.apiBaseService
      .post('zone/chat/notification/broadcard_group_user_display', {
        group_id: groupId
      })
      .toPromise();
  }

  getOwnUserProfile() {
    return this.userService.getSyncProfile();
  }

  updatePhotoMessage(
    messageId: any,
    groupId: any,
    fileJson: any
  ): Promise<any> {
    return this.apiBaseService
      .put('zone/chat/message/' + messageId, {
        group_id: groupId,
        file_json: fileJson,
        id: messageId
      })
      .toPromise()
      .then((res: any) => {
        console.log('updatePhotoMessage: ', res);
        return res;
      });
  }
}
