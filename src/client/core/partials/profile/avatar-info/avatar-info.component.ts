import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PartialsProfileService } from '../profile.service';
import { UserService } from '../../../shared/services/user.service';
import { ProfileConfig } from '../profile-config.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-avatar-info',
  templateUrl: 'avatar-info.component.html'
})

export class PartialsProfileAvatarInfoComponent {
  @Input('data') data: any;
  @Input() config: ProfileConfig;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  nickname: AbstractControl;

  constructor(private fb: FormBuilder, private profileService: PartialsProfileService, public userService: UserService) {
    this.form = fb.group({
      'first_name': ['', Validators.compose([Validators.required])],
      'last_name': ['', Validators.compose([Validators.required])],
      // 'nickname': ['', Validators.compose([Validators.required])]
      'nickname': ['']
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
    if (this.config.callApiAfterChange) {
      this.profileService.updateMyProfile(values).subscribe((res: any) => {
        this.modal.close();
        this.data = res.data;
        this.userService.profile.name = this.data.name;
        this.userService.profile.first_name = this.data.first_name;
        this.userService.profile.last_name = this.data.last_name;
        this.userService.cookieService.put('profile', JSON.stringify(this.userService.profile), this.userService.cookieOptionsArgs);
      });
    } else {
      this.modal.close();
      this.data.name = values.first_name + ' ' + values.last_name;
      this.data.nickname = values.nickname;
    }
  }
}
