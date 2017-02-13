import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

declare var _:any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-add-contact',
  templateUrl: 'add-contact.component.html'
})

export class ZChatShareAddContactComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;
  friends:any = [];

  constructor(private chatService: ChatService ) {

  }

  ngOnInit() {
    this.chatService.getFriends().subscribe(
    (res:any) => {
      this.friends = res.data;
    });
  }

  addContact() {
    // console.log( $('.new-contact').prop('checked', true) );
    // this.chatService.addContact(id);
    // this.modal.close();
    let friends = _.filter(this.friends, { checked: true });
    let ids = _.map(friends, 'id');
    this.chatService.addContact(ids);
    this.modal.close();
  }

  checkbox(e:any, friend:any) {
    console.log(e, friend, this.friends );
  }
}
