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
import { Constants } from '../../../shared/config/constants';
import { ProfileConfig } from '../profile-config.model';

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
  @Input() config: ProfileConfig;

  @HostBinding('class') class = 'field-group';

  form: FormGroup;

  emailType: any = Constants.emailType;

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
    if (this.config.callApiAfterChange) {

      let urlApi = (this.config.onEditCustomUrl ? this.config.onEditCustomUrl : 'zone/social_network/users');

      this.apiBaseService.put(`${urlApi}/` + this.data.uuid, values).subscribe((res: any) => {
        this.removeAll();
        this.data = res.data;
        _.map(this.data.emails, (v: any)=> {
          this.addItem(v);
        });
      });


    } else {
      this.data.emails = values.emails;
    }
    this.modal.close();
  }

  getEmailControls() {
    return (<FormGroup>(<FormGroup>this.form.get('emails')))['controls'];
  }
}
