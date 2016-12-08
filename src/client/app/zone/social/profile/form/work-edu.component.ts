import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from '@angular/forms';
import { CustomValidator } from '../../../../shared/validator/custom.validator';
import { SocialService } from '../../services/social.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-form-workedu',
  templateUrl: 'work-edu.component.html'
})

export class ZSocialProfileFormWorkEduComponent implements OnInit, OnChanges {
  @ViewChild('modal') modal: HdModalComponent;
  @Input() data: any;
  @Input() action: string;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';
  list: any = [];

  countriesCode: any;

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private socialService: SocialService,
              private userService: UserService) {
    this.form = fb.group({
      'works': fb.array([
        this.initWork(),
      ]),
      'educations': fb.array([
        this.initEducation(),
      ])
    });
  }

  ngOnInit() {
    this.removeAll();
  }

  ngOnChanges() {
    this.removeAll();
    let _this = this;
    if (this.data) {
      this.removeAll();

      let additional_employment_edit = this.data.employment;
      _.map(additional_employment_edit, (v)=> {
        _this.addWork(v);
      });

      let additional_education_edit = this.data.education;
      _.map(additional_education_edit, (v)=> {
        _this.addEducation(v);
      });
    }
  }

  onCheckLength(event: any) {
    $(event.target).parents('.form-group').find('.x-showLength').text(event.target.value.length);
  }

  removeAll() {
    const control_work = <FormArray>this.form.controls['works'];
    for (let i = 0; i < control_work.length; i++) {
      control_work.removeAt(i);
      control_work.reset();
    }
    const control_education = <FormArray>this.form.controls['educations'];
    for (let i = 0; i < control_education.length; i++) {
      control_education.removeAt(i);
      control_education.reset();
    }
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


  onHideModal() {
    this.modal.close();
  }

  onSubmit(values: any): void {

    console.log(values);

    // get links if link is not empty
    let emails_filter = [];
    _.map(values.email, (v)=> {
      if (v.email != '') {
        emails_filter.push(v);
      }
    });

    let body = JSON.stringify({
      email: emails_filter
    });

    console.log('body:', body);

    this.apiBaseServiceV2.put(`zone/social_network/users/${this.data.uuid}`, body)
      .subscribe((result: any) => {
          console.log(result);
          //this.updated.emit(result.data);
        },
        error => {
          console.log(error);
        }
      );

    this.modal.close();
  }
}
