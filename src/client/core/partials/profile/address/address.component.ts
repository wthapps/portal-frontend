import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-address',
  templateUrl: 'address.component.html'
})

export class PartialsProfileAddressComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;

  form: FormGroup;

  addressType: any = [
    {
      type: 'home',
      name: 'Home'
    },
    {
      type: 'work',
      name: 'Work'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'addresses': fb.array([
        this.initItem(),
      ])
    });

    console.log(this.form);
  }

  removeAll() {
    const control = <FormArray>this.form.controls['addresses'];
    control.controls.length = 0;
    control.reset();
  }

  //addresses
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        type: [item.type, Validators.compose([Validators.required])],
        address: [item.address, Validators.compose([Validators.required])]
      });
    } else {
      return this.fb.group({
        type: ['', Validators.compose([Validators.required])],
        address: ['', Validators.compose([Validators.required])]
      });
    }
  }

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['addresses'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls['addresses'];
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
