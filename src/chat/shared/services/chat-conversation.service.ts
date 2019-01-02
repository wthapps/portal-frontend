import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBaseService, ChatCommonService, StorageService, UserService, CommonEventHandler, CommonEventService } from '@wth/shared/services';
import { CONVERSATION_SELECT } from '@shared/constant';
import { takeUntil } from 'rxjs/operators';


declare var _: any;
declare var Promise: any;

@Injectable()
export class ChatConversationService extends CommonEventHandler {
  groupSelected: any;
  channel = 'ChatConversationService';

  constructor(
    public storage: StorageService,
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
}
