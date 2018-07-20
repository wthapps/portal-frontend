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
  UserService, WMessageService, StorageItem
} from '@wth/shared/services';
import {
  ChatConstant, CHAT_CONVERSATIONS, CHAT_RECENT_CONVERSATIONS,
  CHAT_FAVOURITE_CONVERSATIONS, CHAT_HISTORY_CONVERSATIONS, CONVERSATION_SELECT, CURRENT_CHAT_MESSAGES, USERS_ONLINE,
  NUMBER_MESSAGE
} from '@wth/shared/constant';
import { FileUploaderService } from '@shared/services/file/file-uploader.service';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators/map';
import { ConversationService } from '@chat/shared/services';


declare var _: any;
declare var Promise: any;

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
    private messageService: WMessageService,
    private fileService: GenericFileService,
    private conversationService: ConversationService
  ) {
    // =============================
    this.constant = ChatConstant;

    // trigger changes in chat notification data
    this.storage.getAsync(CHAT_CONVERSATIONS).subscribe((value: any) => {
      if(value && value.data)
        this.handler.triggerEvent('on_conversation_changes', value.data);
    });
  }

  initalize() {
    this.subscribeNotification();
    // Init get data
    this.getConversationsAsync().subscribe();
  }

  getConversations(option: any = {}) {
    let res: any = this.storage.find(CHAT_CONVERSATIONS);
    if (res && res.value && !option.forceFromApi) {
      return res;
    } else {
      this.apiBaseService.get('zone/chat/contacts').toPromise().then((res: any) => {
        this.storage.save(CHAT_CONVERSATIONS, res);
        this.chatCommonService.setRecentConversations();
        this.chatCommonService.setFavouriteConversations();
        this.chatCommonService.setHistoryConversations();
        this.chatCommonService.setDefaultSelectContact();
      });
      return res;
    }
  }

  getConversationsAsync(option: any = {}): Observable<StorageItem> {
    return new Observable((observer: any) => {
      const res: any = this.storage.find(CHAT_CONVERSATIONS);
      if (res && res.value && !option.forceFromApi) {
        observer.next(res);
        observer.complete();
      } else {
        this.apiBaseService.get('zone/chat/contacts').toPromise().then((res: any) => {
          this.storage.save(CHAT_CONVERSATIONS, res);
          this.chatCommonService.setRecentConversations();
          this.chatCommonService.setFavouriteConversations();
          this.chatCommonService.setHistoryConversations();
          observer.next(this.storage.find(CHAT_CONVERSATIONS));
          observer.complete();
        });
      }
    });
  }

  getChatConversationsAsync(): Observable<{[partner_id: string]: any}> {
    const currentUser = this.userService.getSyncProfile();
    return this.storage.getAsync(CHAT_CONVERSATIONS).pipe(
      map((item: any) => (!item ? {} : item.data.reduce((r, a) => ({...r, [a.partner_id]: a}), {}))), // includes all contacts that have couple conversation with current user
      map((item: any) => ({...item, [currentUser.id]: currentUser})) // includes current user id as well
    );
  }

  getUserContacts(option: any = {}): Observable<any> {
    return this.apiBaseService.get('contact/contacts/internal_contacts');
  }

  getRecentConversations(): Observable<any> {
    return this.storage.getAsync(CHAT_RECENT_CONVERSATIONS);
  }

  getFavouriteConversations(): Observable<any> {
    return this.storage.getAsync(CHAT_FAVOURITE_CONVERSATIONS);
  }

  getHistoryConversations(): Observable<any> {
    // return this.storage.find('chat_history_conversations');
    return this.storage.getAsync(CHAT_CONVERSATIONS);
  }

  selectContact(contact: any) {
    // this.storage.save(CONVERSATION_SELECT, contact);
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
    let conversations: any = this.storage.find(CHAT_CONVERSATIONS).value;
    let contact: any = _.find(conversations.data, { partner_id: id });
    if (contact) {
      this.selectContact(contact);
      this.router.navigate([`${this.constant.conversationUrl}/${contact.id}`]);
    }
  }

  getContactByPartnerId(id: any) {
    let conversations: any = this.storage.find(CHAT_CONVERSATIONS).value;
    return _.find(conversations.data, { partner_id: id });
  }

  getContactSelect(): any {
    return this.storage.find(CONVERSATION_SELECT);
  }

  getContactSelectAsync(): Observable<any> {
    return this.storage.getAsync(CONVERSATION_SELECT);
  }

  getMessages(groupId: number, options: any = {}): void {
    let item: any = this.storage.find('chat_messages_group_' + groupId);
    if (item && item.value) {
      if (this.storage.find(CONVERSATION_SELECT).value.group_id == groupId) {
        this.storage.save(CURRENT_CHAT_MESSAGES, item.value);
      }
    } else {
      this.storage.save(CURRENT_CHAT_MESSAGES, null);
      this.apiBaseService
        .get('zone/chat/message/' + groupId, options)
        .subscribe((res: any) => {
          this.storage.save('chat_messages_group_' + groupId, res);
          if (
            this.storage.find(CONVERSATION_SELECT).value &&
            this.storage.find(CONVERSATION_SELECT).value.group_id == groupId
          ) {
            this.storage.save(CURRENT_CHAT_MESSAGES, res);
          }
        });
    }
  }

  getCurrentMessagesAsync() {
    return this.storage.getAsync(CURRENT_CHAT_MESSAGES);
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
    let recentContacts = this.storage.find(CHAT_RECENT_CONVERSATIONS);
    return _.map(recentContacts.value, 'group_id')[0];
  }

  getLatestConversation(groupId: number) {
    return this.apiBaseService.get('zone/chat/message/' + groupId);
  }

  sendMessage(groupId: any, data: any, option: any = {}): Promise<any> {
    return this.apiBaseService
      .post('zone/chat/message', { group_id: groupId, data: data })
      .toPromise();
  }

  sendTextMessage(message: any, option: any = {}): Promise<any> {
    let item = this.storage.find(CONVERSATION_SELECT);
    if (item && item.value && message) {
      return this.sendMessage(
        item.value.group_json.id,
        { message: message, type: 'text' },
        option
      );
    }
    return Promise.resolve(null);
  }

  updateMessage(conversationId: any, message: any): Observable<any> {
    return this.apiBaseService.put(
      `zone/chat/conversations/${conversationId}/messages`,
      { message: message }
    );
  }

  uploadPhotoOnWeb(photo: any) {
    let groupId = this.storage.find(CONVERSATION_SELECT).value.group_json.id;
    this.sendMessage(groupId, { type: 'file', id: photo.id, object: 'Photo' });
  }

  createUploadingFile(files?: any) {
    let filesAddedPolicy = FileUploadPolicy.allowMultiple(files);
    filesAddedPolicy.forEach((file: any) => {
      let groupId = this.storage.find(CONVERSATION_SELECT).value.group_json
        .id;
      let message: Message = new Message({
        message: 'Sending file.....',
        message_type: 'file',
        content_type: 'media/generic'
      });
      if (file.allow) {
        this.sendMessage(groupId, message, null)
          .then((response: any) => {
          file.parent = {
            id: response.data.id,
            uuid: '',
            type: 'Chat::Message'
          };
          this.fileUploaderService
            .uploadGenericFile(file)
            .subscribe((res: any) => {
                console.log('send file successfully', res);
                this.messageService.scrollToBottom();
            });
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

  getUsersOnline(): Observable<any> {
    return this.storage.getAsync(USERS_ONLINE);
  }

  loadMoreMessages(): Promise<any> {
    let current = this.storage.find(CURRENT_CHAT_MESSAGES).value || {};
    let currentMessages: any = current.data || [];
    let page: any = 1;
    if (current.meta && +current.meta.page < +current.meta.page_count)
      page = parseInt(current.meta.page) + 1;
    else
      return Promise.resolve({data: []});
    let body: any = { page: page };
    let groupId: any = this.storage.find(CONVERSATION_SELECT).value.group_json
      .id;
    return this.apiBaseService
      .get('zone/chat/message/' + groupId, body)
      .toPromise().then((res: any) => {
        res.data = _chat.combineMessages(currentMessages, res.data);
        this.storage.save('chat_messages_group_' + groupId, res);
        if (
          this.storage.find(CONVERSATION_SELECT).value.group_id == groupId
        ) {
          this.storage.save(CURRENT_CHAT_MESSAGES, res);
        }
        return res;
      });
  }

  searchMessages(text: any) {
    let currentMessages: any = this.storage.find(CURRENT_CHAT_MESSAGES).value
      .data;
    let page: any = parseInt(
      this.storage.find(CURRENT_CHAT_MESSAGES).value.meta.page
    );
    let body: any = { q: 'message:1' };
    let groupId: any = this.storage.find(CONVERSATION_SELECT).value.group_json
      .id;

    let sequenceCall = (nextPage: any, currentPage: any): any => {
      if (nextPage == currentPage) {
        return [];
      }
      this.apiBaseService
        .get('zone/chat/message/' + groupId, { page: nextPage })
        .subscribe((res: any) => {
          res.data = _chat.combineMessages(
            this.storage.find(CURRENT_CHAT_MESSAGES).value.data,
            res.data
          );
          this.storage.save('chat_messages_group_' + groupId, res);
          this.storage.save(CURRENT_CHAT_MESSAGES, res);
          sequenceCall(parseInt(res.meta.page) + 1, currentPage);
        });
    };

    this.apiBaseService
      .get('zone/chat/message/' + groupId, body)
      .subscribe((res: any) => {
        res.data = _chat.combineMessages(currentMessages, res.data);
        this.storage.save('chat_messages_group_' + groupId, res);
        this.storage.save(CURRENT_CHAT_MESSAGES, res);
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
      CONVERSATION_SELECT
    ).value.notification = !this.storage.find(CONVERSATION_SELECT).value
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
      .then(_ => this.chatCommonService.updateConversationBroadcast(contact.group_id))
      .then(_ => {
          this.storage.removeItemOfKey(CHAT_RECENT_CONVERSATIONS, contact);
          // this.selectContact(nextRecentConversation);
          const nextRecentConversation = this.storage.find(CHAT_RECENT_CONVERSATIONS).value && this.storage.find(CHAT_RECENT_CONVERSATIONS).value[0];
          return nextRecentConversation ? this.router.navigate([ChatConstant.conversationUrl, nextRecentConversation.id])
            : this.router.navigate([ChatConstant.conversationUrl]);
        });
  }

  removeFromConversation(contact: any, userId: any): Promise<any> {
    return this.updateGroupUser(
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
        this.storage.save(CHAT_CONVERSATIONS, res);
        this.chatCommonService.updateAll();
        return res;
      });
  }

  addMembersGroup(friends: any, group?: any) {
    let groupId: any = null;
    if (group) {
      groupId = group;
    } else {
      groupId = this.storage.find(CONVERSATION_SELECT).value.group_json.id;
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
        // if (setDefaultOnSelect) {
        //   this.chatCommonService.setDefaultSelectContact();
        // }
        const nextRecentConversation = this.storage.find(CHAT_RECENT_CONVERSATIONS).value && this.storage.find(CHAT_RECENT_CONVERSATIONS).value[0];

        this.chatCommonService.updateAll();
        return this.router.navigate([ChatConstant.conversationUrl, _.get(nextRecentConversation, 'id', '')]);
      }
    );
  }

  searchUsers(name: any): Observable<any> {
    return this.apiBaseService.post('users/search', { q: `name:${name}` });
  }

  shareContact(ids: any) {
    let item = this.storage.find(CONVERSATION_SELECT);
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
        let item = this.storage.find(CHAT_CONVERSATIONS);
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

  // *************************************************************************************
  // Start onversation region
  // All of method of conversation here
  createConversation(payload: any) {
    this.conversationService.create(payload).subscribe(response => {
      this.chatCommonService.updateConversationBroadcast(response.data.id);
    });
  }
  // End conversation region
  // *************************************************************************************
}
