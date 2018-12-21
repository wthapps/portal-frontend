import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { ChatContactService } from './chat-contact.service';
import { Message } from '../models/message.model';
import { _chat } from '../utils/chat.functions';
import {
  ChatCommonService,
  CommonEventService,
  GenericFileService,
  HandlerService,
  PhotoUploadService,
  StorageService,
  UserService, WMessageService, StorageItem, ApiBaseService, CommonEventHandler
} from '@wth/shared/services';
import {
  ChatConstant, CHAT_CONVERSATIONS, CHAT_RECENT_CONVERSATIONS,
  CHAT_FAVOURITE_CONVERSATIONS, CHAT_HISTORY_CONVERSATIONS, CONVERSATION_SELECT, USERS_ONLINE,
  NUMBER_MESSAGE,
  CHAT_MESSAGES_GROUP_
} from '@wth/shared/constant';
import { FileUploaderService } from '@shared/services/file/file-uploader.service';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators/map';
import { ConversationService } from '@chat/shared/services';
import { Conversation } from '@chat/shared/models/conversation.model';
import { BlackListPolicy } from '@shared/policies/black-list-policy';
import { SizePolicy } from '@shared/policies/size-policy';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';


declare var _: any;
declare var Promise: any;
export const CONCURRENT_UPLOAD = 2;

@Injectable()
export class ChatService extends CommonEventHandler implements OnDestroy {
  public constant: any;
  public channel = 'ChatService';

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
    super(commonEventService);
    // =============================
    this.constant = ChatConstant;

    // trigger changes in chat notification data
    this.storage.getAsync(CHAT_CONVERSATIONS).subscribe((value: any) => {
      if (value && value.data) {
        this.handler.triggerEvent('on_conversation_changes', value.data);
      }
    });
  }

  initalize() {
    this.subscribeNotification();
    // Init get data
    this.getConversationsAsync().subscribe();
  }

  getConversations(option: any = {}) {
    const res: any = this.storage.find(CHAT_CONVERSATIONS);
    if (res && res.value && !option.forceFromApi) {
      return res;
    } else {
      this.apiBaseService.get('zone/chat/contacts').toPromise().then((conv: any) => {
        this.storage.save(CHAT_CONVERSATIONS, conv);
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
        this.apiBaseService.get(option.url || 'zone/chat/contacts').toPromise().then((conv: any) => {
          this.storage.save(CHAT_CONVERSATIONS, conv);
          this.chatCommonService.setRecentConversations();
          this.chatCommonService.setFavouriteConversations();
          this.chatCommonService.setHistoryConversations();
          observer.next(this.storage.find(CHAT_CONVERSATIONS));
          observer.complete();
        });
      }
    });
  }

  // For detecting users in Chat contact in order to detect online / offline user status
  getChatConversationsAsync(): Observable<{[partner_id: string]: any}> {
    const currentUser = this.userService.getSyncProfile();
    return this.storage.getAsync(CHAT_CONVERSATIONS).pipe(
      map((item: any) => (!_.get(item, 'data') ? {}
      : item.data.reduce((r, a) => ({...r, [a.partner_id]: a}), {}))),
      // includes all contacts that have couple conversation with current user
      map((item: any) => ({...item, [currentUser.id]: currentUser})) // includes current user id as well
    );
  }

  getUserContacts(option: any = {}): Observable<any> {
    return this.apiBaseService.get('contact/wcontacts/internal_contacts');
  }

  getRecentConversations(): Observable<any> {
    return this.storage.getAsync(CHAT_RECENT_CONVERSATIONS);
  }

  getFavouriteConversations(): Observable<any> {
    return this.storage.getAsync(CHAT_FAVOURITE_CONVERSATIONS);
  }

  getHistoryConversations(): Observable<any> {
    // return this.storage.find('chat_history_conversations');
    return this.storage.getAsync(CHAT_HISTORY_CONVERSATIONS);
  }

  selectContact(contact: any) {
    if (contact.notification_count > 0) {
      this.markAsRead(contact.group_json.id);
    }
  }

  subscribeNotification() {
    this.handler.addListener(
      'remove_notification_after_select',
      'on_conversation_select',
      (contact: any) => {
        if (contact.notification_count > 0) {
          this.markAsRead(contact.group_json.id);
        }
      }
    );
  }

  selectContactByPartnerId(id: any) {
    const conversations: any = this.storage.find(CHAT_CONVERSATIONS).value;
    const contact: any = _.find(conversations.data, { partner_id: id });
    if (contact) {
      this.selectContact(contact);
      this.router.navigate([`${this.constant.conversationUrl}/${contact.group_id}`]);
    }
  }

  getContactByPartnerId(id: any) {
    const conversations: any = this.storage.find(CHAT_CONVERSATIONS).value;
    return _.find(conversations.data, { partner_id: id });
  }

  getContactSelect(): any {
    return this.storage.find(CONVERSATION_SELECT);
  }

  getContactSelectAsync(): Observable<any> {
    return this.storage.getAsync(CONVERSATION_SELECT);
  }

  getMessages(groupId: number, options: any = {}): Promise<any> {
    const messages: any = this.storage.getValue(CHAT_MESSAGES_GROUP_ + groupId);
    if (messages && !options.force) {
      this.commonEventService.broadcast({
        channel: 'ConversationDetailComponent',
        action: 'updateCurrent'
      });
      return Promise.resolve(messages);
    }
    return this.apiBaseService
      .get('zone/chat/message/' + groupId, options)
      .toPromise()
      .then((res: any) => {
        this.storage.save(CHAT_MESSAGES_GROUP_ + groupId, res);
        this.commonEventService.broadcast({
          channel: 'ConversationDetailComponent',
          action: 'updateCurrent'
        });
      });
  }

  setConversationSelectedByGroupId(id: number) {
    this.getConversationsAsync().toPromise().then(res =>{
      let selectedContact:any = res.value.data.find(contact => contact.group_id == id);
      if (selectedContact) {
        this.storage.save(CONVERSATION_SELECT, selectedContact);
        this.getMessages(selectedContact.group_id);
      }
    })
  }

  isExistingData(key: string) {
    const data = this.storage.find(key);
    if (data == null) {
      return false;
    }
    return true;
  }

  setValue(key: string, data: any) {
    this.storage.save(key, data);
  }

  getValue(key: string) {
    return this.storage.find(key);
  }

  getLatestGroupId(): any {
    const recentContacts = this.storage.find(CHAT_RECENT_CONVERSATIONS);
    return _.map(recentContacts.value, 'group_id')[0];
  }

  getLatestConversation(groupId: number) {
    return this.apiBaseService.get('zone/chat/message/' + groupId);
  }

  createMessage(groupId: any = null, data: any, option: any = {}): Observable<any> {
    // TODO this will be remvoe after getting groupId from UI
    const conversationId = groupId || this.storage.find(CONVERSATION_SELECT).value.group_json.id;
    return this.apiBaseService.post('zone/chat/message', { group_id: conversationId, data: data });
  }

  sendMessage(groupId: any = null, data: any, option: any = {}): Promise<any> {
    // TODO this will be remvoe after getting groupId from UI
    const conversationId = groupId || this.storage.find(CONVERSATION_SELECT).value.group_json.id;

    return this.apiBaseService
      .post('zone/chat/message', { group_id: conversationId, data: data })
      .toPromise();
  }

  sendTextMessage(message: any, option: any = {}): Promise<any> {
    const item = this.storage.find(CONVERSATION_SELECT);
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
    return this.apiBaseService.put(   `zone/chat/conversations/${conversationId}/messages`,
      { message: message }
    );
  }

  uploadMediaOnWeb(media: any): Promise<any> {
    const groupId = this.storage.find(CONVERSATION_SELECT).value.group_json.id;
    return this.sendMessage(groupId, { type: 'file', id: media.id, object: media.object_type || 'Photo' });
  }

  createUploadingFile(files?: any) {
    const groupId = this.storage.find(CONVERSATION_SELECT).value.group_json
      .id;
    const message: Message = new Message({
      message: 'Sending file.....',
      message_type: 'file',
      content_type: 'media/generic'
    });
    const filesAddedPolicy = FileUploadPolicy.allowMultiple(files, [new BlackListPolicy(), new SizePolicy(35, { only: /video\//g })]);
    const validFiles = filesAddedPolicy.filter((item: any) => item.allow);

    // upload multiple files in batch of CONCURRENT_UPLOAD, usually set as 4
    from(validFiles).pipe(
      mergeMap(file => this.sendMessage(groupId, message, null),
      (file, response) => {
        return Object.assign(file, {parent: {
                  id: response.data.id,
                  uuid: '',
                  type: 'Chat::Message'}});
      },
      CONCURRENT_UPLOAD
      ),
      mergeMap(file => this.fileUploaderService.uploadGenericFile(file),
        (file, response) => (response),
        CONCURRENT_UPLOAD
      )
    ).subscribe(res => {
      console.log('send file successfully', res);
              setTimeout(() => this.messageService.scrollToBottom(), 500);
    });

    const tmp = filesAddedPolicy.filter((item: any) => !item.allow);
    if (tmp && tmp.length > 0) {
      this.commonEventService.broadcast({
        channel: 'LockMessage',
        payload: tmp
      });
    }
  }

  getUsersOnline(): Observable<any> {
    return this.storage.getAsync(USERS_ONLINE);
  }

  loadMoreMessages(): Promise<any> {
    const groupId: any = this.storage.find(CONVERSATION_SELECT).value.group_json
      .id;
    const current = this.storage.getValue('chat_messages_group_' + groupId);
    const currentMessages: any = current.data || [];
    let page: any = 1;
    if (current && current.meta && +current.meta.page < +current.meta.page_count) {
      page = +current.meta.page + 1;
    } else {
      return Promise.resolve({data: []});
    }
    const body: any = { page: page };
    return this.apiBaseService
      .get('zone/chat/message/' + groupId, body)
      .toPromise().then((res: any) => {
        const combinedData = _chat.combineMessages(currentMessages, res.data);
        this.storage.save('chat_messages_group_' + groupId, { ...res, data: combinedData});
        return res;
      });
  }

  addGroupUserFavorite(contact: any) {
    const body: any = { favourite: !contact.favourite };
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
    this.updateGroupUser(contact.group_id, { deleted: true }).then(res => {
      this.getConversationsAsync({ forceFromApi: true}).toPromise().then(res => {
        this.router.navigate(['/conversations'])
      })
    })
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
      .then(() => this.chatCommonService.updateConversationBroadcast(contact.group_id))
      .then(() => {
          this.storage.removeItemOfKey(CHAT_RECENT_CONVERSATIONS, contact);
          // this.selectContact(nextRecentConversation);
          const nextRecentConversation = this.storage.find(CHAT_RECENT_CONVERSATIONS).value
          && this.storage.find(CHAT_RECENT_CONVERSATIONS).value[0];
          return nextRecentConversation ? this.router.navigate([ChatConstant.conversationUrl, nextRecentConversation.id])
            : this.router.navigate([ChatConstant.conversationUrl]);
        });
  }

  removeFromConversation(contact: any, userId: any): Promise<any> {
    return this.updateGroupUser(
      contact.group_id,
      { remove_from_conversation: true, user_id: userId })
      .then((res: any) => {
        // Update another conversations to update their status
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
    const body = { add_members: true, user_ids: friends };
    this.apiBaseService
      .put(`zone/chat/group/${groupId}`, body)
      .subscribe((res: any) => {
        this.chatCommonService.updateConversationBroadcast(groupId);
      });
  }

  addMemberGroups(friendId: any, groupIds: any) {
    for (const groupId of groupIds) {
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
        this.getMessages(contact.group_id, { force: true });
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
        const nextRecentConversation = this.storage.find(CHAT_RECENT_CONVERSATIONS).value
        && this.storage.find(CHAT_RECENT_CONVERSATIONS).value[0];

        this.chatCommonService.updateAll();
        return this.router.navigate([ChatConstant.conversationUrl, _.get(nextRecentConversation, 'id', '')]);
      }
    );
  }

  searchUsers(name: any): Observable<any> {
    return this.apiBaseService.post('users/search', { q: `name:${name}` });
  }

  shareContact(ids: any) {
    const item = this.storage.find(CONVERSATION_SELECT);
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
      .toPromise().then((res: any) => {
        const item = this.storage.find(CHAT_CONVERSATIONS);
        if (item && item.value) {
          const contact = _.find(item.value.data, (ct: any) => {
            if (ct.group_json.id === groupId) {
              return ct;
            }
          });
          if (contact) {
            contact.notification_count = 0;
          }
        }
        this.chatCommonService.updateAll();
      });
  }

  updateDisplayNotification(groupId: any): Promise<any
    > {
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
      // Update another conversations to update their status
      this.chatCommonService.updateConversationBroadcast(response.data.id);
    });
  }
  // End conversation region
  // *************************************************************************************
}
