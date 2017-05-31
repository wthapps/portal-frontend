import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../shared/validator/custom.validator';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-email',
  templateUrl: 'email.component.html'
})

export class PartialsProfileEmailComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;

  form: FormGroup;

  emailType: any = [
    {
      type: 'work',
      name: 'Work'
    },
    {
      type: 'personal',
      name: 'Personal'
    },
    {
      type: 'other',
      name: 'Other'
    },
  ];

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'emails': fb.array([
        this.initItem(),
      ])
    });

    console.log(this.form);
  }

  removeAll() {
    const control = <FormArray>this.form.controls['emails'];
    control.controls.length = 0;
    control.reset();
  }

  //emails
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        type: [item.type, Validators.compose([Validators.required])],
        email: [item.email, Validators.compose([Validators.required, CustomValidator.emailFormat])]
      });
    } else {
      return this.fb.group({
        type: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])]
      });
    }
  }

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['emails'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls['emails'];
    control.removeAt(i);
  }

  onOpenModal() {
    this.modal.open();
    let _this = this;

    _this.removeAll();

    _.map(this.data, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    console.log(values);
  }
}
