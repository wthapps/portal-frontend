import { Component, ViewChild, OnInit } from '@angular/core';
import { PhotoDetailModalComponent } from '../../core/partials/photo/modal/photo-detail-modal.component';
import { ChatService } from '../shared/services/chat.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
declare var _: any;
const KEY_ESC = 27;

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'chat-photo-detail',
  templateUrl: 'photo-detail.component.html',
  styleUrls: ['photo-detail.component.css']
})
export class ChatPhotoDetailComponent implements OnInit{
  @ViewChild('photoDetailModal') photoDetailModal: PhotoDetailModalComponent;
  messageId:any;

  constructor(private chatService: ChatService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParams: any) => {
        console.log('queryParams', queryParams);
        this.messageId = queryParams.message;
      }
    );
  }

  onEditEvent(event:any) {
    let conversationItem = this.chatService.getContactSelect();
    this.chatService.updatePhotoMessage(this.messageId, conversationItem.value.group_json.id, event.data);
  }
}
