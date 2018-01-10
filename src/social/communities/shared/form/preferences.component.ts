import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormBuilder
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { SocialService } from '../../../shared/services/social.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { UserService } from '@wth/shared/services';





@Component({

  selector: 'z-social-community-form-preference',
  templateUrl: 'preferences.component.html'
})

export class ZSocialCommunityFormPreferenceComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('modal') modal: ModalComponent;
  @Input() data: any;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';
  isAdmin: boolean = false;

  form: FormGroup;
  setting_notification_posts: AbstractControl;
  setting_notification_request: AbstractControl;
  hasChange: boolean = false;

  private destroySubject: Subject<any> = new Subject<any>();


  constructor(private fb: FormBuilder,
              private socialService: SocialService,
              private loadingService: LoadingService,
              private wthConfirmService: WthConfirmService,
              private userService: UserService) {

    this.form = fb.group({
      'setting_notification_posts': [false],
      'setting_notification_request': [false]
    });

    this.setting_notification_posts = this.form.controls['setting_notification_posts'];
    this.setting_notification_request = this.form.controls['setting_notification_request'];
  }

  ngOnInit() {
    this.form.valueChanges.takeUntil(this.destroySubject.asObservable())
      .subscribe(data => {
      this.hasChange = true;
      // console.log('form changes', data);
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  ngOnChanges(data: any) {
    if (this.data) {
      this.hasChange = false;
      console.log(this.data.admin);

      if (this.data.admin) {
        // check if admin
        this.isAdmin = (this.data.admin.uuid == this.userService.getSyncProfile().uuid) ? true : false;
      }

      /*(<FormControl>this.setting_notification_posts).setValue(this.data.setting_notification_posts);*/
      /*(<FormControl>this.setting_notification_request).setValue(this.data.setting_notification_request);*/
    }
  }

  getValue(value: any): any {
    this.hasChange = true;
    return value;
  }

  onSubmit(data?: any): void {
    let body = JSON.stringify({
      // setting_notification_posts: this.setting_notification_posts,
      // setting_notification_request: this.setting_notification_request,

      is_close: (this.data.is_close) ? true : false,
      searchable_level: this.data.searchable_level,
      posted_level: this.data.posted_level
    });
    console.log(body);


    // this.apiBaseService.put(`zone/social_network/communities/${this.data.uuid}`, body)
    this.socialService.community.updateCommunity(this.data.uuid, body)
      .subscribe((result: any) => {
          this.updated.emit(result.data);
        },
        (error: any) => {
          console.log(error);
        }
      );

    this.modal.close();
  }

  resetSettings() {
    this.modal.close();
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to reset settings',
      header: 'Reset Default',
      accept: () => {
        // this.apiBaseService.put(`zone/social_network/communities/${this.data.uuid}/reset_settings`)
        this.socialService.community.resetSettings(this.data.uuid)
          .subscribe((result: any) => {
              this.data = result.data;
            },
            (error: any) => {
              console.log(error);
            }
            );
      },
      reject: () => {
        this.modal.open();
      }
    });
  }
}
