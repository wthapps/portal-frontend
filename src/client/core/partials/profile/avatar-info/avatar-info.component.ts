import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PartialsProfileService } from '../profile.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-avatar-info',
  templateUrl: 'avatar-info.component.html'
})

export class PartialsProfileAvatarInfoComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  nickname: AbstractControl;

  constructor(private fb: FormBuilder, private profileService: PartialsProfileService) {
    this.form = fb.group({
      'first_name': ['', Validators.compose([Validators.required])],
      'last_name': ['', Validators.compose([Validators.required])],
      'nickname': ['', Validators.compose([Validators.required])]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.nickname = this.form.controls['nickname'];
  }

  onOpenModal() {
    (<FormControl>this.first_name).setValue(this.data.first_name);
    (<FormControl>this.last_name).setValue(this.data.last_name);
    (<FormControl>this.nickname).setValue(this.data.nickname);

    this.modal.open();
  }


  onSubmit(values: any): void {
    this.profileService.updateMyProfile(values).subscribe((res: any) => {
      this.data = res.data;
      this.modal.close();
    });
  }
}
