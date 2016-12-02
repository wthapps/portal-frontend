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
  isAdmin: boolean = false;

  form: FormGroup;
  setting_notification_posts: AbstractControl;
  setting_notification_request: AbstractControl;


  constructor(private fb: FormBuilder,
              private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private userService: UserService) {

    this.form = fb.group({
      'setting_notification_posts': [false],
      'setting_notification_request': [false]
    });

    this.setting_notification_posts = this.form.controls['setting_notification_posts'];
    this.setting_notification_request = this.form.controls['setting_notification_request'];
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.data) {
      console.log(this.data);

      // check if admin
      this.isAdmin = (this.data.admin.uuid == this.userService.profile.uuid) ? true : false;


      /*(<FormControl>this.setting_notification_posts).setValue(this.data.setting_notification_posts);*/
      /*(<FormControl>this.setting_notification_request).setValue(this.data.setting_notification_request);*/
    }
  }

  getValue(value: any): any {
    return value;
  }

  onSubmit(values: any): void {
    console.log(values);

    let body = JSON.stringify({
      // setting_notification_posts: this.setting_notification_posts,
      // setting_notification_request: this.setting_notification_request,

      is_close: (this.data.is_close) ? true : false,
      searchable_level: this.data.searchable_level,
      posted_level: this.data.posted_level
    });
    console.log(body);


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

  resetSettings() {
    this.apiBaseServiceV2.put(`zone/social_network/communities/${this.data.uuid}/reset_settings`)
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
