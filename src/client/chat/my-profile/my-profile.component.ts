import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZChatMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  constructor(private route: ActivatedRoute,
              private chatService: ChatService) {
  }

  ngOnInit() {

  }

  onOpen(user: any) {
    this.modal.open();
  }

  onClose() {
    setTimeout(()=> {
      console.log('adaafafaf');
    }, 500);
  }
}
