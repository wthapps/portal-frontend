import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../validator/custom.validator';
import { Constants } from '../../config/constants';
import { ProfileFormMixin } from '../../mixins/form/profile/profile-form.mixin';
import { Mixin } from '../../../design-patterns/decorator/mixin-decorator';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'invitation-create-modal',
  templateUrl: 'invitation-create-modal.component.html'
})

export class InvitationCreateModalComponent implements OnInit {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;
  deleteObjects: any = [];
  type: string = 'emails';

  emailType: any = Constants.emailType;

  removeItem: (i: number, item: any) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    // this.form = this.fb.group({
    //   'emails': this.fb.array([
    //     this.initItem(),
    //   ])
    // });
  }

  open(options?: any) {
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  //emails
  // initItem(item?: any) {
  //   if (item) {
  //     return this.fb.group({
  //       category: [item.category, Validators.compose([Validators.required])],
  //       id: [item.id, Validators.compose([Validators.required])],
  //       value: [item.value, Validators.compose([Validators.required, CustomValidator.emailFormat])]
  //     });
  //   } else {
  //     return this.fb.group({
  //       category: ['work', Validators.compose([Validators.required])],
  //       value: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])]
  //     });
  //   }
  // }

  // addItem(item?: any) {
  //   const control = <FormArray>this.form.controls['emails'];
  //   if (item) {
  //     control.push(this.initItem(item));
  //   } else {
  //     control.push(this.initItem());
  //   }
  // }

  onOpenModal() {
    this.modal.open();
    // this.removeAll();
    // _.map(this.data.emails, (v: any)=> {
    //   this.addItem(v);
    // });
    // this.addItem();
  }
}
