import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBaseService, ChatCommonService, StorageService, UserService, CommonEventHandler, CommonEventService } from '@wth/shared/services';
import { CONVERSATION_SELECT, STORE_CONVERSATIONS, STORE_CONTEXT, STORE_SELECTED_CONVERSATION, STORE_MESSAGES } from '@shared/constant';
import { takeUntil, filter, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SET_CHAT_CONVERSATIONS, ADD_CHAT_CONVERSATION_NOTIFICATION, UPDATE_CHAT_CONVERSATIONS, SET_CHAT_SELECTED } from '@core/store/chat/conversations.reducer';
import { of } from 'rxjs';


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

  navigateToConversation(groupId: any){
    this.router.navigate(['/conversations', groupId]);
  }
  // alias navigateToConversation
  goToConversation(groupId: any){
    this.navigateToConversation(groupId)
  }

  apiAddMembers(members: any){
    const body = { add_members: true, user_ids: members.map(user => user.id) };
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
    return this.apiBaseService.get('zone/chat/contacts').toPromise().then((res: any) => {
      this.store.dispatch({ type: SET_CHAT_CONVERSATIONS, payload: res });
      return res;
    });
  }

  getStoreConversations() {
    return this.store.select(STORE_CONVERSATIONS);
  }

  getStoreSelectedConversation(){
    return this.store.select(STORE_SELECTED_CONVERSATION).pipe(
      // filter selectedConversation empty
      filter(cx => {
      return cx.selectedConversation && cx.selectedConversation.group_id;}),
      // map to selected Convervarion
      map(cx => cx.selectedConversation))
  }

  addNotification(data: any){
    this.store.dispatch({ type: ADD_CHAT_CONVERSATION_NOTIFICATION, payload: data})
  }

  addRemoveMember(data: any){
    this.updateStoreConversation(data.group_user);
  }

  updateStoreConversation(conversation: any){
    this.store.dispatch({ type: UPDATE_CHAT_CONVERSATIONS, payload: conversation})
  }

  apiDeleteConversation(contact: any) {
    of(contact).pipe(withLatestFrom(this.store.select(STORE_MESSAGES)), map(([contact, messages]) => {
      this.apiUpdateGroupUser(contact.group_id, { deleted: true, notification_count: 0, message_from: messages.data[messages.data.length - 1].id + 1 || 1})
        .then(res => this.apiGetConversations())
        .then(r2 => this.router.navigate(['/conversations']));
    })).toPromise().then(res => {

    })
  }

  apHideConversation(contact: any) {
    this.apiUpdateGroupUser(contact.group_id, { deleted: true })
      .then(res => this.apiGetConversations())
      .then(r2 => this.router.navigate(['/conversations']));
  }

  apiUpdateGroupUser(groupId: any, data: any) {
    return this.apiBaseService
      .put('zone/chat/group_user/' + groupId, data)
      .toPromise().then((res: any) => {
        this.store.dispatch({ type: SET_CHAT_CONVERSATIONS, payload: res });
        return res;
      });
  }

  leaveConversation(contact: any): Promise<any> {
    return this.apiUpdateGroupUser(contact.group_id, { leave: true })
      .then(() => this.chatCommonService.updateConversationBroadcast(contact.group_id))
  }
}
