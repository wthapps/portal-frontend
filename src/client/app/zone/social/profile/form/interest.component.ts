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
              private apiBaseServiceV2: ApiBaseServiceV2,
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
    if (this.data) {
      this.removeAll();

      let additional_hobby_interest_edit = this.data.hobby_interest;
      _.map(additional_hobby_interest_edit, (v)=> {
        _this.addHobbyInterest(v);
      });
    }
  }

  onCheckLength(event: any) {
    $(event.target).closest('.form-group').find('.x-showLength').text(event.target.value.length);
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
