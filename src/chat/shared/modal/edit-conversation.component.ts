import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';

import { ChatService } from '../services/chat.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'z-chat-share-edit-conversation',
  templateUrl: 'edit-conversation.component.html',
  styleUrls: ['edit-conversation.component.scss']
})
export class ZChatShareEditConversationComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() conversation: any;
  usersOnlineItem$: Observable<any>;
  form: FormGroup;
  allow_add: any = true;
  name: any;

  constructor(private chatService: ChatService, private fb: FormBuilder)  {

  }

  ngOnInit() {
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
  }

  onSubmit(): void {
    this.chatService.updateDisplay(this.conversation, {display: {name: this.name}, allow_add: this.allow_add});
    this.modal.close();
  }

  open() {
    this.modal.open().then(e => {
      this.allow_add = (this.conversation.group_json.allow_add || this.conversation.group_json.allow_add == 'true');
      this.name = this.conversation.group_json.name;
    });
  }
}
