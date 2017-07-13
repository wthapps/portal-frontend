import { Component, Input, ViewChild, HostBinding } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ApiBaseService } from '../../../services/apibase.service';
import { ProfileConfig } from '../profile-config.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-address',
  templateUrl: 'address.component.html'
})

export class PartialsProfileAddressComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Input() config: ProfileConfig;

  @HostBinding('class') class = 'field-group';

  form: FormGroup;

  addressType: any = [
    {
      kind_of: 'home',
      name: 'Home'
    },
    {
      kind_of: 'work',
      name: 'Work'
    }
  ];

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {
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
        kind_of: [item.kind_of, Validators.compose([Validators.required])],
        address_line1: [item.address_line1, Validators.compose([Validators.required])]
      });
    } else {
      return this.fb.group({
        kind_of: ['', Validators.compose([Validators.required])],
        address_line1: ['', Validators.compose([Validators.required])]
      });
    }
  }

  addressControls() {
    return (<FormGroup>(<FormGroup>this.form.get('addresses')))['controls'];
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

    _.map(this.data.addresses, (v: any)=> {
      _this.addItem(v);
    });
  }

  getAddressControls() {
    return (<FormGroup>this.form.get('addresses')).controls;
  }


  onSubmit(values: any): void {
    if (this.config.callApiAfterChange) {
      let urlApi = (this.config.onEditCustomUrl ? this.config.onEditCustomUrl : 'zone/social_network/users');

      this.apiBaseService.put(`${urlApi}/` + this.data.uuid, values).subscribe((res:any) => {
        this.removeAll();
        this.data = res.data;
        _.map(this.data.addresses, (v: any)=> {
          this.addItem(v);
        });
      });
    } else {
      this.data.addresses = values.addresses;
    }
    this.modal.close();
  }
}
