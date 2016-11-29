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
  FormControl
} from '@angular/forms';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-form-preference',
  templateUrl: 'preferences.component.html'
})

export class ZSocialCommunityFormPreferenceComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal: HdModalComponent;
  @Input() data: any;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';

  form: FormGroup;
  setting_search_any: AbstractControl;
  setting_search_connected: AbstractControl;
  setting_search_invited: AbstractControl;
  setting_post_member: AbstractControl;
  setting_post_review: AbstractControl;
  setting_post_admin: AbstractControl;
  setting_notification_posts: AbstractControl;
  setting_notification_request: AbstractControl;


  constructor(private fb: FormBuilder,
              private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private userService: UserService) {

    this.form = fb.group({
      'setting_search_any': [false],
      'setting_search_connected': [false],
      'setting_search_invited': [false],
      'setting_post_member': [false],
      'setting_post_review': [false],
      'setting_post_admin': [false],
      'setting_notification_posts': [false],
      'setting_notification_request': [false]
    });

    this.setting_search_any = this.form.controls['setting_search_any'];
    this.setting_search_connected = this.form.controls['setting_search_connected'];
    this.setting_search_invited = this.form.controls['setting_search_invited'];
    this.setting_post_member = this.form.controls['setting_post_member'];
    this.setting_post_review = this.form.controls['setting_post_review'];
    this.setting_post_admin = this.form.controls['setting_post_admin'];
    this.setting_notification_posts = this.form.controls['setting_notification_posts'];
    this.setting_notification_request = this.form.controls['setting_notification_request'];
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.data) {
      console.log(this.data);
      /*(<FormControl>this.setting_search_any).setValue(this.data.setting_search_any);*/
    }
  }

  getValue(value: any) {
    console.log(value);
  }

  onSubmit(values: any): void {
    console.log(values);

    let body = JSON.stringify({
      is_close: this.data.is_close,
      setting_search_any: this.data.setting_search_any,
      setting_search_connected: this.data.setting_search_connected,
      setting_search_invited: this.data.setting_search_invited,
      setting_post_member: this.data.setting_post_member,
      setting_post_review: this.data.setting_post_review,
      setting_post_admin: this.data.setting_post_admin,
      setting_notification_posts: this.data.setting_notification_posts,
      setting_notification_request: this.data.setting_notification_request
    });

    this.apiBaseServiceV2.put(`zone/social_network/communities/${this.data.uuid}`, body)
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
