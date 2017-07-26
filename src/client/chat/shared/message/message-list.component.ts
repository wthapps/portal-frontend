import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'message-list',
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.css']
})

export class MessageListComponent implements OnInit {
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;

  item: any;
  contactItem: any;
  prevMessage: any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.item = this.chatService.getCurrentMessages();

    this.contactItem = this.chatService.getContactSelect();
  }

  onLoadMore() {
    this.chatService.loadMoreMessages();
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
