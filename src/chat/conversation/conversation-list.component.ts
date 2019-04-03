import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { UserService, CommonEventService } from '@shared/services';
import { ContactSelectionService } from './../shared/selections/contact/contact-selection.service';

@Component({
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent implements OnInit, OnDestroy {
  conversations: any;
  destroy$ = new Subject();

  constructor(
    public userService: UserService,
    private contactSelectionService: ContactSelectionService,
  ) {
  }

  ngOnInit() {
    // this.chatConversationService.apiGetConversations().then((res: any) => {
    //   this.conversations = res.data.filter(c => !c.blacklist && !c.left && !c.deleted);
    //   if (this.conversations && this.conversations.length > 0) {
    //     this.chatService.router.navigate([
    //       `${this.chatService.constant.conversationUrl}/${
    //         this.conversations[0].group_id
    //         }`
    //     ]);
    //   }
    // });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddContact() {
    // this.commonEventService.broadcast({
    //   channel: 'ZChatShareAddContactComponent',
    //   action: 'open',
    //   payload: { option: 'addChat' }
    // });

    this.contactSelectionService.open({
      type: 'NEW_CHAT'
    });
  }
}
