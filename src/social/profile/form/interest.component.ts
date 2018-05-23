import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

import { SocialService } from '../../shared/services/social.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService, UserService } from '@wth/shared/services';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';




@Component({

  selector: 'z-social-profile-form-interest',
  templateUrl: 'interest.component.html'
})

export class ZSocialProfileFormInterestComponent implements OnInit, OnChanges {
  @ViewChild('modal') modal: BsModalComponent;
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
    this.addAll();
  }

  ngOnChanges(data: any) {
    this.removeAll();
    this.addAll();
  }

  addAll() {
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

  hobbyInterestControls() {
    return (<FormGroup>(<FormGroup>this.form).controls.hobby_interests).controls;
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
