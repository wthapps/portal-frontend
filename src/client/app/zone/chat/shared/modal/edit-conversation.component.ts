import { Component, OnChanges, ViewChild } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-edit-conversation',
  templateUrl: 'edit-conversation.component.html'
})
export class ZChatShareEditConversationComponent implements OnChanges {
  @ViewChild('modal') modal: HdModalComponent;


  form: FormGroup;
  name: AbstractControl;
  chat_history_everyone: AbstractControl;
  everyone_can_add: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])],
      'chat_history_everyone': [true],
      'everyone_can_add': [true]
    });

    this.name = this.form.controls['name'];
    this.chat_history_everyone = this.form.controls['chat_history_everyone'];
    this.everyone_can_add = this.form.controls['everyone_can_add'];

  }

  ngOnChanges() {

  }


  onSubmit(values: any): void {
    console.log(values);

    this.modal.close();
  }
}
