import { Component, Input, ViewChild, HostBinding } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../shared/validator/custom.validator';
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-email',
  templateUrl: 'email.component.html'
})

export class PartialsProfileEmailComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  @HostBinding('class') class = 'field-group';

  form: FormGroup;

  emailType: any = [
    {
      kind_of: 'work',
      name: 'Work'
    },
    {
      kind_of: 'personal',
      name: 'Personal'
    },
    {
      kind_of: 'other',
      name: 'Other'
    },
  ];

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {
    this.form = fb.group({
      'emails': fb.array([
        this.initItem(),
      ])
    });
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
        kind_of: [item.kind_of, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.emailFormat])]
      });
    } else {
      return this.fb.group({
        kind_of: ['', Validators.compose([Validators.required])],
        value: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])]
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

    _.map(this.data.emails, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    this.apiBaseService.put('zone/social_network/users/' + this.data.uuid, values).subscribe((res:any) => {
      this.removeAll();
      this.data = res.data;
      _.map(this.data.emails, (v: any)=> {
        this.addItem(v);
      });
      this.modal.close();
    });
  }
}
