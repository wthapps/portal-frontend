import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
// import { ApiBaseService } from '../../../../shared/services/apibase.service';
// import { UserService } from '../../../../shared/services/user.service';
// import { LoadingService } from '../../../../partials/loading/loading.service';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';

import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { SocialService } from '../../services/social.service';
import {ApiBaseService} from "../../../../core/shared/services/apibase.service";
import {LoadingService} from "../../../../core/partials/loading/loading.service";
import {UserService} from "../../../../core/shared/services/user.service";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-form-interest',
  templateUrl: 'interest.component.html'
})

export class ZSocialProfileFormInterestComponent implements OnInit, OnChanges {
  @ViewChild('modal') modal: HdModalComponent;
  @Input() data: any;
  @Input() action: string;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';
  list: any = [];

  countriesCode: any;

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private apiBaseService: ApiBaseService,
              private loadingService: LoadingService,
              private socialService: SocialService,
              private userService: UserService) {
    this.form = fb.group({
      'hobby_interests': fb.array([
        this.initHobbyInterest(),
      ])
    });
  }

  ngOnInit() {
    this.removeAll();
  }

  ngOnChanges() {
    this.removeAll();
    let _this = this;
    if (this.data && this.data.hobby) {
      this.removeAll();

      let additional_hobby_interest_edit = this.data.hobby;
      _.map(additional_hobby_interest_edit, (v: any)=> {
        _this.addHobbyInterest(v);
      });
    }
  }

  removeAll() {
    const control_hobby_interest = <FormArray>this.form.controls['hobby_interests'];
    for (let i = 0; i < control_hobby_interest.length; i++) {
      control_hobby_interest.removeAt(i);
      control_hobby_interest.reset();
    }
  }

  //HobbyInterests
  initHobbyInterest(hobby?: any) {
    if (hobby) {
      return this.fb.group({
        title: [hobby.title],
        description: [hobby.description]
      });
    } else {
      return this.fb.group({
        title: [''],
        description: ['']
      });
    }
  }

  addHobbyInterest(hobby?: any) {
    const control = <FormArray>this.form.controls['hobby_interests'];
    if (hobby) {
      control.push(this.initHobbyInterest(hobby));
    } else {
      control.push(this.initHobbyInterest());
    }
  }

  removeHobbyInterest(i: number) {
    const control = <FormArray>this.form.controls['hobby_interests'];
    control.removeAt(i);
  }


  onHideModal() {
    this.modal.close();
  }

  onSubmit(values: any): void {

    console.log(values);

    this.socialService.user.update({hobby: values.hobby_interests})
      .subscribe((result: any) => {
          console.log(result);
          this.updated.emit(result.data);
        },
        error => {
          console.log(error);
        }
      );

    this.modal.close();
  }
}
