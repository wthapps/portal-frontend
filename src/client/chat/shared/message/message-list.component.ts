import {
  Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output,
  EventEmitter
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'message-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.css']
})

export class MessageListComponent implements OnInit {
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;

  item: any;
  contactItem: any;
  prevMessage: any;
  scrollDistance: number = 1000;

  constructor(private chatService: ChatService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    setInterval(() => {
      this.item = this.chatService.getCurrentMessages();
      this.contactItem = this.chatService.getContactSelect();
      this.ref.markForCheck();
    }, 200);
  }

  onLoadMore() {
    let currentLength = this.item.value.data.length;
    this.chatService.loadMoreMessages();
  }

  scrollDown() {
    if($('#chat-message-text').is(":focus")) this.chatService.markAsRead(this.contactItem.value.group_id);
  }

  onAddContact(contact:any) {
    this.requestModal.contact = contact;
    this.requestModal.modal.open();
  }

  doEvent(event: any) {
    switch(event.action) {
      case 'CONTACT_REQUEST_CREATE':
        this.requestModal.contact = event.data.receiver;
        this.requestModal.modal.open();
        break;
      case 'CONTACT_REQUEST_CANCEL':
        this.chatService.chatContactService.cancelContactRequest(event.data);
        break;
    }
  }

  getPrevMessage(currentMessage: any) {
    let curMsgIndex = _.findIndex(this.item.value.data, {id: currentMessage.id});
    return (curMsgIndex <= 0) ? null: this.item.value.data[curMsgIndex-1];
  }

}
