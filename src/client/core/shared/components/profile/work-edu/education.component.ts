import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PartialsProfileService } from '../profile.service';
import { Mixin } from '../../../../design-patterns/decorator/mixin-decorator';
import { ProfileFormMixin } from '../../../mixins/form/profile/profile-form.mixin';
import { ProfileFormCustomSubmitMixin } from '../../../mixins/form/profile/profile-form-custom-submit.mixin';

declare var _: any;

@Mixin([ProfileFormMixin, ProfileFormCustomSubmitMixin])
@Component({
  moduleId: module.id,
  selector: 'partials-profile-edu',
  templateUrl: 'education.component.html'
})

export class PartialsProfileEducationComponent implements ProfileFormMixin, ProfileFormCustomSubmitMixin {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  contact_note: AbstractControl;
  type: string = "educations";
  deleteObjects: any = [];

  constructor(private fb: FormBuilder,
              private profileService: PartialsProfileService) {
    this.form = fb.group({
      'educations': fb.array([
        this.initEducation(),
      ])
    });
  }

  removeItem:(i: number) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;
  onCustomSubmit:(values: any) => void;

  //Educations
  initEducation(education?: any) {
    if (education) {
      return this.fb.group({
        title: [education.title],
        description: [education.description]
      });
    } else {
      return this.fb.group({
        title: [''],
        description: ['']
      });
    }
  }

  addEducation(education?: any) {
    const control = <FormArray>this.form.controls['educations'];
    if (education) {
      control.push(this.initEducation(education));
    } else {
      control.push(this.initEducation());
    }
  }

  onOpenModal() {
    this.modal.open();
    this.removeAll();

    _.map(this.data.educations, (v: any)=> {
      this.addEducation(v);
    });
  }
}
