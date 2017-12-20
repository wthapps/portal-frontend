import {
  Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { forEach } from '@angular/router/src/utils/collection';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
// import { ProfileFormMixin } from '../../mixins/form/profile/profile-form.mixin';
// import { Mixin } from '../../../design-patterns/decorator/mixin-decorator';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'account-create-partial',
  templateUrl: 'account-create-partial.component.html'
})

export class AccountCreatePartialComponent implements OnInit, OnChanges {
  @Input('data') data: Array<any> = [];

  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  deleteObjects: any = [];
  type: string = 'items';
  noOfCtrl: number = 3;

  // removeItem: (i: number, item: any) => void;
  // onSubmit: (values: any) => void;
  // removeAll: () => void;
  // getFormControls: () => any;

  constructor(private fb: FormBuilder) {
    console.log('testing inside partial::::');
  }

  ngOnInit() {
    this.form = this.fb.group({
      'items': this.fb.array([])
    });
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] != undefined && changes['data'].currentValue != undefined) {
      this.data = changes['data'].currentValue;
      this.initialize();
    }
  }

  initialize() {
    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        this.add(this.data[i]);
      }
    } else {
      for (let i = 0; i < this.noOfCtrl; i++) {
        this.add();
      }
    }
  }

  create(item?: any) {
    if (item) {
      return this.fb.group({
        email: [item.email, Validators.compose([Validators.required, CustomValidator.emailFormat])],
        fullName: [item.fullName],
        contactId: [item.contactId]
      });
    } else {
      return this.fb.group({
        email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])],
        fullName: [''],
        contactId: [null]
      });
    }
  }

  add(item?: any) {
    const control = <FormArray>this.form.controls[this.type];
    if (item) {
      control.push(this.create(item));
    } else {
      control.push(this.create());
    }
  }


  doEvent(options: any) {
    let data = this.form.value.items;
    switch (options.action) {
      case 'done':
        // remove items whose email is empty
        _.remove(data, (item: any) => {
          if(item.email != '') {
            item.fullName = item.email.split('@')[0];
          }
          return item.email == '';
        });
        options['payload'] = data;
        this.event.emit(options);
        break;
      case 'cancel':
        this.event.emit(options);
        break;
      default:
        break;
    }
  }

  done(values: any) {
    this.data = _.concat(this.deleteObjects, values);
    this.event.emit(this.data);
  }

  remove(i: number, item: any) {
    const control = <FormArray>this.form.controls[this.type];
    control.removeAt(i);
    if (item && item.id && item.id.value) {
      _.forEach(this.data, (data: any) => {
        if (data.id == item.id.value) {
          data._destroy = true;
          this.deleteObjects.push(data);
        }
      });
    }
  }

  removeAll() {
    const control = <FormArray>this.form.controls[this.type];
    control.controls.length = 0;
    this.deleteObjects.length = 0;
    control.reset();
  }

  getFormControls() {
    return (<FormArray>this.form.get(this.type)).controls;
  }

}
