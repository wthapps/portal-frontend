import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ApiBaseService } from './apibase.service';
import { HandlerService } from './handler.service';
import { UserService } from '@wth/shared/services/user.service';
import { WMessageService } from '@wth/shared/services/message.service';
import { Router } from '@angular/router';
import { CONVERSATION_SELECT, CHAT_CONVERSATIONS, ACTION, CHAT_MESSAGES_GROUP_ } from '@wth/shared/constant';
import { CommonEventService } from './common-event/common-event.service';

declare var _: any;
declare var Promise: any;

@Injectable()
export class ChatCommonService {
  constructor(
    public storage: StorageService,
    public apiBaseService: ApiBaseService,
    public handler: HandlerService,
    public commonEventService: CommonEventService,
    private messageService: WMessageService,
    private router: Router,
    private userService: UserService
  ) {}

  // Update another conversations to update their status
  updateConversationBroadcast(groupId: any): Promise<any> {
    return this.apiBaseService
      .post('zone/chat/group/broadcast_conversations', { group_id: groupId })
      .toPromise();
  }
}
