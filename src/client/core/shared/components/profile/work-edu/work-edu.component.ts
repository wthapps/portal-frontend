import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PartialsProfileService } from '../profile.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-work-edu',
  templateUrl: 'work-edu.component.html'
})

export class PartialsProfileWorkEduComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  form: FormGroup;
  contact_note: AbstractControl;

  constructor(private fb: FormBuilder,
              private profileService: PartialsProfileService) {
    this.form = fb.group({
      'works': fb.array([
        this.initWork(),
      ]),
      'educations': fb.array([
        this.initEducation(),
      ])
    });
  }

  removeAll() {
    const control_work = <FormArray>this.form.controls['works'];
    control_work.controls.length = 0;
    control_work.reset();

    const control_education = <FormArray>this.form.controls['educations'];
    control_education.controls.length = 0;
    control_education.reset();
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

  addEducation(education?: any) {
    const control = <FormArray>this.form.controls['educations'];
    if (education) {
      control.push(this.initEducation(education));
    } else {
      control.push(this.initEducation());
    }
  }

  removeEducation(i: number) {
    const control = <FormArray>this.form.controls['educations'];
    control.removeAt(i);
  }

  onOpenModal() {
    this.modal.open();
    let _this = this;

    _this.removeAll();

    _.map(this.data.works, (v: any)=> {
      _this.addWork(v);
    });

    _.map(this.data.educations, (v: any)=> {
      _this.addEducation(v);
    });
  }


  onSubmit(values: any): void {
    this.profileService.updateMyProfile(values).subscribe((res: any) => {
      this.data = res.data;
      this.modal.close();
    });
  }

  getWorkControls() {
    return (<FormGroup>(<FormGroup>this.form.get('works')))['controls'];
  }

  getEducationControls() {
    return (<FormGroup>(<FormGroup>this.form.get('educations')))['controls'];
  }
}
