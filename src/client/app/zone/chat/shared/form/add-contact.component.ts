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
  selector: 'z-chat-share-add-contact',
  templateUrl: 'add-contact.component.html'
})
export class ZChatShareAddContactComponent implements OnChanges {
  @ViewChild('modal') modal: HdModalComponent;
}
