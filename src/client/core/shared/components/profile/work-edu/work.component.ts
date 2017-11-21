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
  selector: 'partials-profile-work',
  templateUrl: 'work.component.html'
})

export class PartialsProfileWorkComponent implements ProfileFormMixin, ProfileFormCustomSubmitMixin {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  contact_note: AbstractControl;
  deleteObjects: any = [];
  type: string = 'works';

  removeItem: (i: number, item: any) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;
  onCustomSubmit: (values: any) => void;

  constructor(private fb: FormBuilder,
              private profileService: PartialsProfileService) {
    this.form = fb.group({
      'works': fb.array([
        this.initWork(),
      ])
    });
  }

  //Works
  initWork(work?: any) {
    if (work) {
      return this.fb.group({
        title: [work.title],
        description: [work.description]
      });
    } else {
      return this.fb.group({
        title: [''],
        description: ['']
      });
    }
  }

  addWork(work?: any) {
    const control = <FormArray>this.form.controls['works'];
    if (work) {
      control.push(this.initWork(work));
    } else {
      control.push(this.initWork());
    }
  }

  removeWork(i: number) {
    const control = <FormArray>this.form.controls['works'];
    control.removeAt(i);
  }

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

  onOpenModal() {
    this.modal.open();
    this.removeAll();
    _.map(this.data.works, (v: any)=> {
      this.addWork(v);
    });
    this.addWork();
  }
}
