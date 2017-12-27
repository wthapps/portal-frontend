import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder
} from '@angular/forms';

import 'rxjs/add/operator/toPromise';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { SoCommunityService } from '../services/community.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { UserService } from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

@Component({

  selector: 'z-social-share-community-form-preferences',
  templateUrl: 'preferences-community.component.html'
})

export class ZSocialShareCommunityFormPreferenceComponent implements OnInit, OnChanges {
  @ViewChild('modal') modal: ModalComponent;
  @Input() data: any;
  @Output() setupDataUpdated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';
  isAdmin: boolean = false;

  form: FormGroup;
  setting_notification_posts: AbstractControl;
  setting_notification_request: AbstractControl;
  hasChange: boolean = false;


  constructor(private fb: FormBuilder,
              private loadingService: LoadingService,
              private userService: UserService,
              private communityService: SoCommunityService,
              private wthConfirmService: WthConfirmService) {
    this.form = fb.group({
      'setting_notification_posts': [false],
      'setting_notification_request': [false]
    });

    this.setting_notification_posts = this.form.controls['setting_notification_posts'];
    this.setting_notification_request = this.form.controls['setting_notification_request'];
  }

  ngOnInit() {

  }

  ngOnChanges(data: any) {

  }

  onOpenModal(data?: any) {
    this.hasChange = false;
    if (data) {
      this.data = data;
    }

    if (this.data.admin) {
      // check if admin
      this.isAdmin = (this.data.admin.uuid == this.userService.profile.uuid) ? true : false;
    }

    /*(<FormControl>this.setting_notification_posts).setValue(this.data.setting_notification_posts);*/
    /*(<FormControl>this.setting_notification_request).setValue(this.data.setting_notification_request);*/

    this.modal.open();
  }

  getValue(value: any): any {
    this.hasChange = true;
    return value;
  }

  onSubmit(data: any): void {
    this.loadingService.start();

    let body = JSON.stringify({
      // setting_notification_posts: this.setting_notification_posts,
      // setting_notification_request: this.setting_notification_request,

      is_close: (this.data.is_close) ? true : false,
      searchable_level: this.data.searchable_level,
      posted_level: this.data.posted_level
    });

    this.communityService.updateCommunity(this.data.uuid, body).toPromise().then((res: any) => {
      this.loadingService.stop();

      // this.setupDataUpdated.emit(res.data);
      this.modal.close();
    },(err: any) => {
      this.loadingService.stop();
      this.modal.close();
    });

  }

  resetSettings() {
    this.modal.close();
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to reset settings',
      header: 'Reset Default',
      accept: () => {
        this.loadingService.start();
        this.communityService.resetSettings(this.data.uuid)
          .toPromise().then((res: any) => {
              this.loadingService.stop();
              this.data = res.data;
              this.setupDataUpdated.emit(res.data);
            },
            (error: any) => {
              this.loadingService.stop();
              console.log(error);
            }
          );
      },
      reject: () => {
        this.modal.open();
      }
    });
    // this.modal.close();
  }

}
