import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PartialsProfileService } from '../profile.service';
import { ProfileConfig } from '../profile-config.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-hobby',
  templateUrl: 'hobby.component.html'
})

export class PartialsProfileHobbyComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Input() config: ProfileConfig;

  form: FormGroup;

  constructor(private fb: FormBuilder, private profileService: PartialsProfileService) {
    this.form = fb.group({
      'hobbys': fb.array([
        this.initItem(),
      ])
    });
  }

  removeAll() {
    const control = <FormArray>this.form.controls['hobbys'];
    control.controls.length = 0;
    control.reset();
  }

  //hobbys
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        title: [item.title],
        description: [item.description]
      });
    } else {
      return this.fb.group({
        title: [''],
        description: ['']
      });
    }
  }

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['hobbys'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls['hobbys'];
    control.removeAt(i);
  }

  onOpenModal() {
    this.modal.open();
    let _this = this;

    _this.removeAll();

    _.map(this.data.hobbys, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    console.log(values);
    this.profileService.updateMyProfile(values).subscribe((res: any) => {
      this.data = res.data;
      this.modal.close();
    });
  }

  getHobbyControls() {
    return (<FormGroup>(<FormGroup>this.form.get('hobbys')))['controls'];
  }
}
