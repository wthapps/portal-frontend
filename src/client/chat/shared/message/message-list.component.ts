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
    // this.chatService.subscribeChanel();
  }

  onLoadMore() {
    this.chatService.loadMoreMessages();
  }

  onAddContact(contact:any) {
    console.log(contact);
    this.requestModal.contact = contact;
    this.requestModal.modal.open();
  }

  getPrevMessage(currentMessage: any) {
    let curMsgIndex = _.findIndex(this.item.value.data, {id: currentMessage.id});
    return (curMsgIndex <= 0) ? null: this.item.value.data[curMsgIndex-1];
  }

}
