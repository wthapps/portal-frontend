import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
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
  selector: 'partials-profile-avatar-info-name-only',
  templateUrl: 'avatar-info-name-only.component.html'
})

export class PartialsProfileAvatarInfoNameOnlyComponent {
  @Input('data') data: any;
  @Input() config: ProfileConfig;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  name: AbstractControl;

  constructor(private fb: FormBuilder, private profileService: PartialsProfileService, public userService: UserService) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])],
    });

    this.name = this.form.controls['name'];
  }

  onOpenModal() {
    (<FormControl>this.name).setValue(this.data.name);
    this.modal.open();
  }


  onSubmit(values: any): void {
    this.eventOut.emit(values);
    this.data.name = values.name;
    this.modal.close();
  }
}
