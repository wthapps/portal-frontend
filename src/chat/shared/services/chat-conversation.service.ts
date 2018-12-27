import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBaseService, ChatCommonService, StorageService, UserService } from '@wth/shared/services';


declare var _: any;
declare var Promise: any;

@Injectable()
export class ChatConversationService {

  constructor(
    public storage: StorageService,
    public apiBaseService: ApiBaseService,
    public chatCommonService: ChatCommonService,
    public router: Router
  ) {

  }

  navigateToConversation(groupId: any){
    this.router.navigate(['/conversations', groupId]);
  }
  // alias navigateToConversation
  goToConversation(groupId: any){
    this.navigateToConversation(groupId)
  }
}
