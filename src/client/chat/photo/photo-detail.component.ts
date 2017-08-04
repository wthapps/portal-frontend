import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ChatService } from '../shared/services/chat.service';
import { PhotoService } from '../../core/shared/services/photo.service';
import { ConfirmationService } from 'primeng/primeng';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { BasePhotoDetailComponent } from '../../core/shared/components/photo/detail/base-photo-detail.component';


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
    protected confirmationService: ConfirmationService,
    protected loadingService: LoadingService,
    private chatService: ChatService,
    protected photoService: PhotoService
  ) {
    super(route, router, confirmationService, loadingService, photoService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.messageId = queryParams.message;
      }
    );
  }

  doEvent(event: any) {
    switch(event.action) {
      // Handle all of event in child class here
      case 'update':
      default:
        // TODO considering update logic here!!!
        let conversationItem = this.chatService.getContactSelect();
        this.chatService.updatePhotoMessage(this.messageId, conversationItem.value.group_json.id, event.data);
        super.doEvent(event);
        break;
    }
  }
}
