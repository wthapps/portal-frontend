import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBaseService, ChatCommonService, StorageService, UserService, CommonEventHandler, CommonEventService, CommonEvent } from '@wth/shared/services';
import { CONVERSATION_SELECT, STORE_CONVERSATIONS, STORE_CONTEXT, STORE_SELECTED_CONVERSATION, STORE_MESSAGES } from '@shared/constant';
import { takeUntil, filter, map, withLatestFrom, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { CHAT_CONVERSATIONS_SET, CHAT_CONVERSATIONS_ADD_NOTIFICATION, CHAT_CONVERSATIONS_UPDATE, CHAT_CONVERSATIONS_LOAD_MORE, CHAT_CONVERSATIONS_MARK_AS_READ } from '@core/store/chat/conversations.reducer';
import { of } from 'rxjs';
import { Conversations } from '@shared/shared/models/chat/conversations.model';


declare var _: any;
declare var Promise: any;

@Injectable()
export class ChatConversationService extends CommonEventHandler {
  channel = 'ChatConversationService';
  selectedConversation: any = {};

  constructor(
    public storage: StorageService,
    public store: Store<any>,
    public apiBaseService: ApiBaseService,
    public chatCommonService: ChatCommonService,
    public commonEventService: CommonEventService,
    public router: Router
  ) {
    super(commonEventService);
  }

  navigateToConversation(groupId: any) {
    this.router.navigate(['/conversations', groupId]);
  }
  // alias navigateToConversation
  goToConversation(groupId: any) {
    this.navigateToConversation(groupId)
  }

  apiAddMembers(event: CommonEvent) {
    const body = { add_members: true, user_ids: event.payload.map(user => user.id) };
    of(body).pipe(withLatestFrom(this.getStoreSelectedConversation()), map(([data, sc]) => {
      this.apiBaseService
        .put(`zone/chat/group/${sc.group_id}`, data)
        .subscribe((res: any) => {
          // Update another conversations to update their status
          this.chatCommonService.updateConversationBroadcast(sc.group_id).then((response: any) => {
          });
        });
    })).toPromise().then(res => {

    });
  }

  apiGetConversations(option: any = {}): Promise<any> {
    return this.apiBaseService.get('zone/chat/group', option).toPromise().then((res: any) => {
      this.store.dispatch({ type: CHAT_CONVERSATIONS_SET, payload: res });
      return res;
    });
  }

  apiGetMoreConversations() {
    this.getStoreConversations().pipe(take(1)).subscribe(conversations => {
      if (conversations.meta && conversations.meta.links.next) {
        this.apiBaseService.get(conversations.meta.links.next).subscribe(res => {
          this.store.dispatch({ type: CHAT_CONVERSATIONS_LOAD_MORE, payload: res });
        });
      }
    })
  }

  getStoreConversations() {
    return this.store.select(STORE_CONVERSATIONS);
  }

  getStoreSelectedConversation(): any {
    return this.store.select(STORE_SELECTED_CONVERSATION).pipe(
      // filter selectedConversation empty
      filter(cx => {
      return cx.selectedConversation && cx.selectedConversation.group_id;}),
      // map to selected Convervarion
      map(cx => cx.selectedConversation));
  }

  addNotificationEvent(event: CommonEvent) {
    this.addNotification(event.payload);
  }

  addNotification(data: any) {
    this.store.dispatch({ type: CHAT_CONVERSATIONS_ADD_NOTIFICATION, payload: data });
  }

  addRemoveMember(event: CommonEvent) {
    this.updateStoreConversation(event.payload.group_user);
  }

  updateStoreConversationEvent(event: CommonEvent) {
    this.updateStoreConversation(event.payload)
  }

  updateStoreConversation(conversation: any) {
    this.store.dispatch({ type: CHAT_CONVERSATIONS_UPDATE, payload: conversation })
  }

  updateStoreConversationsEvent(event: CommonEvent) {
    this.updateStoreConversations(event.payload);
  }

  updateStoreConversations(conversations: any) {
    this.store.dispatch({ type: CHAT_CONVERSATIONS_SET, payload: conversations })
  }

  apiDeleteConversation(contact: any) {
    of(contact).pipe(withLatestFrom(this.store.select(STORE_MESSAGES)), map(([contact, messages]) => {
      let id = messages.data[messages.data.length - 1] ? messages.data[messages.data.length - 1].id + 1 : 0;
      this.apiUpdateGroupUser(contact.group_id, { deleted: true, notification_count: 0, message_from: id })
        .then(res => this.apiGetConversations())
        .then(r2 => this.router.navigate(['/conversations']));
    })).toPromise().then(res => {

    })
  }

  apHideConversation(contact: any) {
    this.apiUpdateGroupUser(contact.group_id, { deleted: true })
      .then(r2 => this.router.navigate(['/conversations']));
  }

  apiUpdateGroupUser(groupId: any, data: any) {
    return this.apiBaseService
      .put('zone/chat/group_user/' + groupId, data)
      .toPromise().then((res: any) => {
        this.store.dispatch({ type: CHAT_CONVERSATIONS_UPDATE, payload: res.data });
        return res;
      });
  }

  markAsRead(contact: any) {
    this.apiBaseService
      .post('zone/chat/notification/mark_as_read', { id: contact.group_id })
      .toPromise().then((res: any) => {
        this.commonEventService.broadcast({
          channel: 'ChatNotificationComponent',
          action: 'addNotificationEvent',
          payload: { notification_count: 0, last_notification_count: res.data.last_notification_count }
        });
        this.store.dispatch({ type: CHAT_CONVERSATIONS_MARK_AS_READ, payload: res.data });
      });
  }

  apiFavoriteGroupUser(conversation: any) {
    return this.apiUpdateGroupUser(conversation.id, { favorite: !conversation.favorite });
  }

  apiNotificationGroupUser(conversation: any) {
    return this.apiUpdateGroupUser(conversation.id, { notification: !conversation.notification });
  }

  leaveConversation(contact: any): Promise<any> {
    return this.apiUpdateGroupUser(contact.group_id, { leave: true })
      .then(() => this.chatCommonService.updateConversationBroadcast(contact.group_id))
  }

  acceptRequest(contact: any) {
    return this.apiUpdateGroupUser(
      contact.group_id,
      { accept_friend: true }).then(res => {
        return this.chatCommonService.updateConversationBroadcast(contact.group_id);
      });
  }

  declineRequest(contact: any) {
    this.apiUpdateGroupUser(
      contact.group_id,
      { status: 'decline' })
      // .then(res => this.apiGetConversations())
      .then(r2 => this.router.navigate(['/conversations']));
  }

  removeFromConversation(contact: any, userId: any): Promise<any> {
    return this.apiUpdateGroupUser(
      contact.group_id,
      { remove_from_conversation: true, user_id: userId })
      .then((res: any) => {
        // Update another conversations to update their status
        return this.chatCommonService.updateConversationBroadcast(contact.group_id);
      }
      );
  }

  moveToFirst(sc: any) {
    this.getStoreConversations().pipe(take(1)).subscribe((conversations: Conversations) => {
      conversations.moveToFirst(sc);
    })
  }


  updateDisplay(contact: any, data: any) {
    this.apiUpdateGroupUser(contact.group_id, data)
      .then((res: any) => {
        return this.chatCommonService.updateConversationBroadcast(contact.group_id);
      });
  }
}
