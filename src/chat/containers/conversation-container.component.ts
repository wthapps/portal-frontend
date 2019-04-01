// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
// import { UserService, CommonEventService } from '@shared/services';
// import { ChatService } from '../shared/services/chat.service';
// import { ChatConversationService } from '@chat/shared/services/chat-conversation.service';
// import { Subject } from 'rxjs';
//
// @Component({
//   templateUrl: 'conversation-container.component.html'
// })
// export class ConversationContainerComponent implements OnInit, OnDestroy {
//   conversations: any;
//   destroy$ = new Subject();
//
//   constructor(
//     public userService: UserService,
//     private chatService: ChatService,
//     private chatConversationService: ChatConversationService,
//     private commonEventService: CommonEventService,
//     private addContactService: ZChatShareAddContactService
//   ) {
//   }
//
//   ngOnInit() {
//     this.chatConversationService.apiGetConversations().then((res: any) => {
//       this.conversations = res.data.filter(c => !c.blacklist && !c.left && !c.deleted);
//       if (this.conversations && this.conversations.length > 0) {
//         this.chatService.router.navigate([
//           `${this.chatService.constant.conversationUrl}/${
//             this.conversations[0].group_id
//             }`
//         ]);
//       }
//     });
//   }
//
//   ngOnDestroy(){
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
//
//   onAddContact() {
//     this.commonEventService.broadcast({
//       channel: 'ZChatShareAddContactComponent',
//       action: 'open',
//       payload: { option: 'addChat' }
//     });
//   }
// }
