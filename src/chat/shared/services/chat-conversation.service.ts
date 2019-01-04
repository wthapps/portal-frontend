import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBaseService, ChatCommonService, StorageService, UserService, CommonEventHandler, CommonEventService } from '@wth/shared/services';
import { CONVERSATION_SELECT, STORE_CONVERSATIONS, STORE_CONTEXT } from '@shared/constant';
import { takeUntil, filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SET_CHAT_CONVERSATIONS, ADD_CHAT_CONVERSATION_NOTIFICATION, UPDATE_CHAT_CONVERSATIONS, SET_CHAT_SELECTED } from '@core/store/chat/conversations.reducer';


declare var _: any;
declare var Promise: any;

@Injectable()
export class ChatConversationService extends CommonEventHandler {
  groupSelected: any;
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
    this.storage.getAsync(CONVERSATION_SELECT).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.groupSelected = res.group;
      }
    });
  }

  navigateToConversation(groupId: any){
    this.router.navigate(['/conversations', groupId]);
  }
  // alias navigateToConversation
  goToConversation(groupId: any){
    this.navigateToConversation(groupId)
  }

  addMembers(members: any){
    const body = { add_members: true, user_ids: members.map(user => user.id) };
    this.apiBaseService
      .put(`zone/chat/group/${this.groupSelected.id}`, body)
      .subscribe((res: any) => {
        // Update another conversations to update their status
        this.chatCommonService.updateConversationBroadcast(this.groupSelected.id).then((response: any) => {
        });
      });
  }

  getConversations(option: any = {}): Promise<any> {
    return this.apiBaseService.get('zone/chat/contacts').toPromise().then((res: any) => {
      this.store.dispatch({ type: SET_CHAT_CONVERSATIONS, payload: res });
    });
  }

  setConversationSelectedByGroupId(id: number) {

  }

  getSelectedConversation(){
    return this.store.select(STORE_CONTEXT).pipe(
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
    this.updateConversation(data.group_user);
  }

  updateConversation(conversation: any){
    this.store.dispatch({ type: UPDATE_CHAT_CONVERSATIONS, payload: conversation})
  }
}
