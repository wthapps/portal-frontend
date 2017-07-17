import { Component, Input, ViewChild, HostBinding, OnInit, Output, EventEmitter } from '@angular/core';
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

export class PartialsProfileAddressComponent implements OnInit {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Input() config: ProfileConfig;

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
      name: 'Work'
    }
  ];

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'addresses': this.fb.array([
        this.initItem(),
      ])
    });
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
        category: [item.category, Validators.compose([Validators.required])],
        address_line1: [item.address_line1, Validators.compose([Validators.required])]
      });
    } else {
      return this.fb.group({
        category: ['', Validators.compose([Validators.required])],
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
    // if (this.config.callApiAfterChange) {
    //   let urlApi = (this.config.onEditCustomUrl ? this.config.onEditCustomUrl : 'zone/social_network/users');
    //
    //   this.apiBaseService.put(`${urlApi}/` + this.data.uuid, values).subscribe((res:any) => {
    //     this.removeAll();
    //     this.data = res.data;
    //     _.map(this.data.addresses, (v: any)=> {
    //       this.addItem(v);
    //     });
    //   });
    // } else {
    //   this.data.addresses = values.addresses;
    // }
    this.data.addresses = values.addresses;
    this.eventOut.emit(values);
    this.modal.close();
  }
}
