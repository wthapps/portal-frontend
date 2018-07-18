import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'z-chat-share-edit-conversation',
  templateUrl: 'edit-conversation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZChatShareEditConversationComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() conversation: any;
  usersOnlineItem$: Observable<any>;
  // chat_history_everyone: AbstractControl;
  // everyone_can_add: AbstractControl;
  constructor(private chatService: ChatService)  {

  }

  ngOnInit() {
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
  }

  onSubmit(): void {
    this.chatService.updateDisplay(this.conversation, {display: this.conversation.display});
    this.modal.close();
  }

  open() {
    this.modal.open();
  }
}
