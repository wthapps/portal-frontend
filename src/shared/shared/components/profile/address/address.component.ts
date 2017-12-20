import { Component, Input, ViewChild, HostBinding, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ApiBaseService } from '../../../../services/apibase.service';
import { ProfileFormMixin } from '../../../mixins/form/profile/profile-form.mixin';
import { Mixin } from '../../../../design-patterns/decorator/mixin-decorator';

declare var _: any;

@Mixin([ProfileFormMixin])
@Component({
    selector: 'partials-profile-address',
  templateUrl: 'address.component.html'
})

export class PartialsProfileAddressComponent implements OnInit, ProfileFormMixin {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;

  addressType: any = [
    {
      category: 'home',
      name: 'Home'
    },
    {
      category: 'work',
      name: 'work'
    },
    {
      category: 'other',
      name: 'Other'
    }
  ];
  type: string = 'addresses';
  deleteObjects: any = [];

  removeItem: (i: number, item: any) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {
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
        category: [item.category, Validators.compose([Validators.required])],
        address_line1: [item.address_line1, Validators.compose([Validators.required])],
        po_box: [item.po_box],
        city: [item.city],
        province: [item.province],
        postcode: [item.postcode],
        country: [item.country]

      });
    } else {
      return this.fb.group({
        category: ['home', Validators.compose([Validators.required])],
        address_line1: ['', Validators.compose([Validators.required])],
        po_box: [''],
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
    _.map(this.data.addresses, (v: any)=> {
      this.addItem(v);
    });
    this.addItem();
  }

  getAddressControls() {
    return (<FormGroup>this.form.get('addresses')).controls;
  }
}
