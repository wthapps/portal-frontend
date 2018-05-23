import { Component, OnInit, ViewChild } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ChatService } from '../services/chat.service';


@Component({
  moduleId: module.id,
  selector: 'z-chat-share-edit-conversation',
  templateUrl: 'edit-conversation.component.html'
})
export class ZChatShareEditConversationComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  item:any;
  // chat_history_everyone: AbstractControl;
  // everyone_can_add: AbstractControl;
  constructor(private chatService: ChatService)  {

  }

  ngOnInit() {
    this.item = this.chatService.getContactSelect();
  }

  onSubmit(): void {
    this.chatService.updateDisplay(this.item.value, {display: this.item.value.display});
    this.modal.close();
  }
}
