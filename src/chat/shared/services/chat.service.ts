import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription, of } from 'rxjs';

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
import { BlackListPolicy } from '@shared/policies/black-list-policy';
import { SizePolicy } from '@shared/policies/size-policy';
import { from } from 'rxjs/observable/from';
import { mergeMap, retry, take, withLatestFrom } from 'rxjs/operators';
import { CHAT_CONVERSATIONS_SET } from '@core/store/chat/conversations.reducer';
import { ChatConversationService } from './chat-conversation.service';
import { ChatMessageService } from './chat-message.service';


declare var _: any;
declare var Promise: any;
export const CONCURRENT_UPLOAD = 4;
const MAX_RETRY = 3;

@Injectable()
export class ChatService extends CommonEventHandler implements OnDestroy {
  public constant: any;
  public channel = 'ChatService';
  private disconnectApiMap: {[group_id: string]: number} = {};

  constructor(
    public storage: StorageService,
    public apiBaseService: ApiBaseService,
    public userService: UserService,
    public chatContactService: ChatContactService,
    public chatMessageService: ChatMessageService,
    public chatCommonService: ChatCommonService,
    public photoUploadService: PhotoUploadService,
    public commonEventService: CommonEventService,
    public router: Router,
    public store: Store<any>,
    public handler: HandlerService,
    public fileUploaderService: FileUploaderService,
    private messageService: WMessageService,
    private fileService: GenericFileService,
    private chatConversationService: ChatConversationService
  ) {
    super(commonEventService);
    // =============================
    this.constant = ChatConstant;
  }

  initalize() {
    // Init get data
    // this.chatConversationService.apiGetConversations();
  }

  getOutOfDateMessages() {
    this.chatConversationService.getStoreConversations().pipe(take(1)).subscribe((converstions: any) => {

      this.disconnectApiMap = {};
      // const loaded_conversations = converstions.data.filter(conv => this.storage.getValue(CHAT_MESSAGES_GROUP_ + conv.group_id));
      // loaded_conversations.forEach(conv => this.getDisconnectedMessages(conv.group_id));
      this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(conv => {
        this.getDisconnectedMessages(conv.group_id)
      })
    })
  }

  getDisconnectedMessages(group_id) {
    this.chatMessageService.getCurrentMessages().pipe(take(1)).subscribe(messages => {
      const last = messages.data.slice(-1);
      if (last.length === 0) {
        return;
      }
      const last_message = last[0].id;

      // Retry maximum 3 tmes for each api calls
      const retry_num = this.disconnectApiMap[group_id];
      this.disconnectApiMap[group_id] = retry_num ? retry_num - 1 : MAX_RETRY;
      if (this.disconnectApiMap[group_id] <= 0) { return; }
      this.apiBaseService
        .get('chat/message/' + group_id, { last_message })
        .toPromise().then((res: any) => {
          console.log('get messages from success: ', res);
          res.data.forEach(message => {
            this.chatMessageService.addCurrentMessages({ message: message });
          })
          delete this.disconnectApiMap[group_id];
        })
        .catch(err => {
          console.error('get disconnected messages error for chat group id: ', group_id, err);
          this.getDisconnectedMessages(group_id);
        });
    })
  }

  selectContact(contact: any) {
    if (contact.notification_count > 0) {
      this.markAsRead(contact.group.id);
    }
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
    return this.apiBaseService.get('chat/message/' + groupId);
  }

  sendMessage(groupId: any = null, data: any, option: any = {}): Promise<any> {
    // TODO this will be remvoe after getting groupId from UI
    const conversationId = groupId || this.storage.find(CONVERSATION_SELECT).value.group.id;

    return this.apiBaseService
      .post('chat/message', { group_id: conversationId, data: data })
      .toPromise();
  }

  updateMessage(conversationId: any, message: any): Observable<any> {
    return this.apiBaseService.put(   `zone/chat/conversations/${conversationId}/messages`,
      { message: message }
    );
  }

  // createUploadingFile(files?: any) {
  //   const groupId = this.storage.find(CONVERSATION_SELECT).value.group.id;
  //   const message: Message = new Message({
  //     message: 'Sending file.....',
  //     message_type: 'file',
  //     content_type: 'media/generic'
  //   });
  //   const filesAddedPolicy = FileUploadPolicy.allowMultiple(files, [new BlackListPolicy(), new SizePolicy(35)]);
  //   const validFiles = filesAddedPolicy.filter((item: any) => item.allow);

  //   // upload multiple files in batch of CONCURRENT_UPLOAD, usually set as 4
  //   from(validFiles).pipe(
  //     mergeMap(file => this.sendMessage(groupId, message, null),
  //     (file, response) => {
  //       return Object.assign(file, {parent: {
  //                 id: response.data.id,
  //                 uuid: '',
  //                 type: 'Chat::Message'}});
  //     },
  //     CONCURRENT_UPLOAD
  //     ),
  //     mergeMap(file => this.fileUploaderService.uploadGenericFile(file),
  //       (file, response) => (response),
  //       CONCURRENT_UPLOAD
  //     )
  //   ).subscribe(res => {
  //     console.log('send file successfully', res);
  //             setTimeout(() => this.messageService.scrollToBottom(), 500);
  //   });

  //   const tmp = filesAddedPolicy.filter((item: any) => !item.allow);
  //   if (tmp && tmp.length > 0) {
  //     this.commonEventService.broadcast({
  //       channel: 'LockMessage',
  //       payload: tmp
  //     });
  //   }
  // }

  getUsersOnline(): Observable<any> {
    return this.storage.getAsync(USERS_ONLINE);
  }

  addGroupUserBlackList(userId: any) {
    this.apiBaseService
      .post('users/users_blacklist', { user_id: userId, module_name: 'chat' })
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  updateNotification(contact: any, data: any) {
    // this.storage.find(
    //   CONVERSATION_SELECT
    // ).value.notification = !this.storage.find(CONVERSATION_SELECT).value
    //   .notification;
    this.updateGroupUser(contact.group_id, data);
  }

  deleteContact(contact: any) {
    // this.updateGroupUser(contact.group_id, { deleted: true })
    // .then(r2 => this.router.navigate(['/conversations']));
  }

  updateGroupUser(groupId: any, data: any) {
    return this.apiBaseService
      .put('zone/chat/group_user/' + groupId, data)
      .toPromise().then((res: any) => {
        this.store.dispatch({type: CHAT_CONVERSATIONS_SET, payload: res});
        return res;
      });
  }

  addMembersGroup(friends: any, group?: any) {
    let groupId: any = null;
    if (group) {
      groupId = group;
    } else {
      groupId = this.storage.find(CONVERSATION_SELECT).value.group.id;
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
    return this.apiBaseService.get('chat/settings');
  }

  updateSetting(body: any) {
    return this.apiBaseService.post('zone/chat/update_setting', body);
  }

  restoreSetting() {
    return this.apiBaseService.post('zone/chat/restore_setting');
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

        // this.chatCommonService.updateAll();
        return this.router.navigate([ChatConstant.conversationUrl, _.get(nextRecentConversation, 'id', '')]);
      }
    );
  }

  searchUsers(name: any): Observable<any> {
    return this.apiBaseService.post('users/search', { q: `name:${name}` });
  }

  shareContact(ids: any) {
    of(ids).pipe(withLatestFrom(this.chatConversationService.getStoreSelectedConversation()), map((ids:any, sc:any) => {
      return {ids: ids, sc: sc}
    })).toPromise().then(res => {
      this.apiBaseService
        .post('zone/chat/contact/share', {
          group_id: res.sc.group.id,
          share_user_ids: ids
        })
        .subscribe((res: any) => {
          // console.log(res);
        });
      for (let i = 0; i < res.ids.length; i++) {
        if (res.sc) {
          this.chatMessageService.create(res.sc.group.id, {
            message: '',
            type: 'contact',
            contact: ids[i]
          });
        }
      }
    })
  }

  markAsRead(groupId: any) {
    this.apiBaseService
      .post('zone/chat/notification/mark_as_read', { id: groupId })
      .toPromise().then((res: any) => {
        const item = this.storage.find(CHAT_CONVERSATIONS);
        if (item && item.value) {
          const contact = _.find(item.value.data, (ct: any) => {
            if (ct.group.id === groupId) {
              return ct;
            }
          });
          if (contact) {
            contact.notification_count = 0;
          }
        }
      });
  }

  getOwnUserProfile() {
    return this.userService.getSyncProfile();
  }
}
