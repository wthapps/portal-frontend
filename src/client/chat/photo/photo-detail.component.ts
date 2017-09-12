import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { ChatService } from '../shared/services/chat.service';
import { PhotoService } from '../../core/shared/services/photo.service';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { BasePhotoDetailComponent } from '../../core/shared/components/photo/detail/base-photo-detail.component';
import { CommonEvent } from '../../core/shared/services/common-event/common-event';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';
import { ConversationService } from '../conversation/conversation.service';
import { WthConfirmService } from '../../core/shared/components/confirmation/wth-confirm.service';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'chat-photo-detail',
  templateUrl: 'photo-detail.component.html',
  styleUrls: ['photo-detail.component.css']
})
export class ChatPhotoDetailComponent extends BasePhotoDetailComponent implements OnInit {
  messageId: any;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected wthConfirmService: WthConfirmService,
    protected loadingService: LoadingService,
    protected chatService: ChatService,
    protected pubSubEventService: CommonEventService,
    protected conversationService: ConversationService,
    protected photoService: PhotoService
  ) {
    super(route, router, wthConfirmService, loadingService, photoService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.params.subscribe(
      (params: any) => {
        console.debug('photo detail - params: ', params);
        this.messageId = params.message;
      }
    );
  }

  doEvent(event: any) {
    console.debug('inside photo-detail: doEvent: ', event);
    switch(event.action) {
      // Handle all of event in child class here
      case 'update':
        // TODO considering update logic here!!!
        let conversationItem = this.chatService.getContactSelect();
        this.chatService.updatePhotoMessage(this.messageId, conversationItem.value.group_json.id, event.data)
          .then((res: any) => console.debug('after updatePhotoMessage: ', res));
        super.doEvent(event);
        break;
      default:
        super.doEvent(event);
        break;
    }
  }

  doAction(event: CommonEvent) {
    var editingEvent = _.cloneDeep(event); // this helps current value doesn't change when users edit message

    this.pubSubEventService.broadcast(editingEvent);
  }

  confirmUpdate(payload: any): Promise<any> {
    return super.confirmUpdate(payload)
      .then((res: any) => {
      this.doEvent({action: 'update', data: res});
    });
  }

  confirmDelete(payload: any): Promise<any> {
    return super.confirmDelete(payload)
      .then((res: any) => {
        let conversationItem = this.chatService.getContactSelect();
        console.debug('conversationItem: ', conversationItem);
        return this.conversationService.deleteMessage(conversationItem.value.group_json.id, this.messageId)
          .toPromise()
          .then((response: any) => {
            console.log('delete ok!!!! YAY');
          });
      });
  }
}
