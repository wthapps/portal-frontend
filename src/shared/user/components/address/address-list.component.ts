import { Component, Input, ViewChild, HostBinding, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, FormControl
} from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ProfileFormMixin } from '../../../shared/mixins/form/profile/profile-form.mixin';
import { Mixins  } from '../../../design-patterns/decorator/mixin-decorator';
import { Constants } from '@shared/constant';

declare var _: any;

@Mixins([ProfileFormMixin])
@Component({
  selector: 'w-user-addresses',
  templateUrl: 'address-list.component.html'
})

export class AddressListComponent implements OnInit, ProfileFormMixin {
  @Input('data') data: any;
  @ViewChild('modal') modal: BsModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;

  addressType = Constants.addressType;
  type = 'addresses';
  deleteObjects: any = [];

  removeItem: (i: number, item: any) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'addresses': this.fb.array([
        this.initItem(),
      ])
    });
  }

  //addresses
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        id: [item.id, Validators.compose([Validators.required])],
        category: [item.category],
        address_line1: [item.address_line1],
        address_line2: [item.address_line2],
        city: [item.city],
        province: [item.province],
        postcode: [item.postcode],
        country: [item.country]

      });
    } else {
      return this.fb.group({
        category: ['home'],
        address_line1: [''],
        address_line2: [''],
        city: [''],
        province: [''],
        postcode: [''],
        country: ['']
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

  onOpenModal() {
    this.modal.open();
    this.removeAll();
    if (this.data.addresses && this.data.addresses.length > 0) {
      _.map(this.data.addresses, (v: any) => {
        this.addItem(v);
      });
    } else {
      this.addItem();
    }
  }

  getAddressControls() {
    return (<FormGroup>this.form.get('addresses')).controls;
  }

  get validItems(): boolean {
    let result = false;
    const items = this.form.value.items;

    if (items.length === 0) return false;
    if (items.length === 1) {
      return this.form.valid;
    }
    _.forEach(this.form.value.items, (item: any) => {
      if (item.email !== '' && item.fistName !== '' && item.lastName !== '') {
        result = true;
      }
    });
    return result;
  }
}
