// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';

// import { ChatService } from '../shared/services/chat.service';
// import { ConversationService } from '../conversation/conversation.service';
// import { BasePhotoDetailComponent } from '@wth/shared/shared/components/photo/detail/base-photo-detail.component';
// import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
// import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
// import {
//   CommonEvent,
//   CommonEventService,
//   PhotoService,
//   UserService
// } from '@wth/shared/services';

// declare let _: any;

// @Component({
//   selector: 'chat-photo-detail',
//   templateUrl: 'photo-detail.component.html',
//   styleUrls: ['photo-detail.component.scss']
// })
// export class ChatPhotoDetailComponent extends BasePhotoDetailComponent
//   implements OnInit {
//   messageId: any;

//   constructor(
//     protected route: ActivatedRoute,
//     protected router: Router,
//     protected wthConfirmService: WthConfirmService,
//     protected loadingService: LoadingService,
//     protected chatService: ChatService,
//     protected pubSubEventService: CommonEventService,
//     protected conversationService: ConversationService,
//     protected userService: UserService,
//     protected photoService: PhotoService
//   ) {
//     super(
//       route,
//       router,
//       wthConfirmService,
//       loadingService,
//       photoService,
//       userService
//     );
//   }

//   ngOnInit() {
//     super.ngOnInit();
//     this.route.params.subscribe((params: any) => {
//       this.messageId = params.message;
//     });
//   }

//   doEvent(event: any) {
//     switch (event.action) {
//       // Handle all of event in child class here
//       case 'update':
//         // TODO considering update logic here!!!
//         let conversationItem = this.chatService.getContactSelect();
//         this.chatService.updatePhotoMessage(
//           this.messageId,
//           conversationItem.value.group_json.id,
//           event.data
//         );
//         super.doEvent(event);
//         break;
//       default:
//         super.doEvent(event);
//         break;
//     }
//   }

//   doAction(event: CommonEvent) {
//     var editingEvent = _.cloneDeep(event); // this helps current value doesn't change when users edit message

//     this.pubSubEventService.broadcast(editingEvent);
//   }

//   confirmUpdate(payload: any): Promise<any> {
//     return super.confirmUpdate(payload).then((res: any) => {
//       this.doEvent({ action: 'update', data: res });
//     });
//   }

//   confirmDelete(payload: any): Promise<any> {
//     return super.confirmDelete(payload).then((res: any) => {
//       let conversationItem = this.chatService.getContactSelect();
//       return this.conversationService
//         .deleteMessage(conversationItem.value.group_json.id, this.messageId)
//         .toPromise()
//         .then((response: any) => {
//           console.log('delete ok!!!! YAY');
//         });
//     });
//   }
// }
