import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'z-chat-share-edit-conversation',
  templateUrl: 'edit-conversation.component.html'
})
export class ZChatShareEditConversationComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() conversation: any;
  // item:any;
  // chat_history_everyone: AbstractControl;
  // everyone_can_add: AbstractControl;
  constructor(private chatService: ChatService)  {

  }

  ngOnInit() {
    // this.item = this.chatService.getContactSelect();
  }

  onSubmit(): void {
    this.chatService.updateDisplay(this.conversation, {display: this.conversation.display});
    this.modal.close();
  }

  open() {
    this.modal.open();
  }
}
