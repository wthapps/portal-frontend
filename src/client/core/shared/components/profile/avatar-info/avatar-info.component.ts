import { Component, Input, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormGroup
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { QuestionBase } from '../../form/base/question-base';
import { QuestionControlService } from '../../form/base/question-control.service';
import { TextboxQuestion } from '../../form/categories/textbox-question';
import { UserInfo } from '../../../models/user/user-info.model';
import { LoadingService } from '../../loading/loading.service';
import { PhotoModalDataService } from '../../../services/photo-modal-data.service';
import { PhotoUploadService } from '../../../services/photo-upload.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../../services/user.service';
import { ToastsService } from '../../toast/toast-message.service';
import { ApiBaseService } from '../../../services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-avatar-info',
  templateUrl: 'avatar-info.component.html',
  styleUrls: ['avatar-info.component.css']
})

export class PartialsProfileAvatarInfoComponent implements OnInit {
  @Input() data: any;
  @Input() editable: boolean = true;
  @Input() nameOnly: boolean = false;
  @ViewChild('modal') modal: ModalComponent;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  closeObs$: Observable<any>;
  nextPhotoSubscription: Subscription;
  uploadPhotoSubscription: Subscription;

  form: FormGroup;
  questions: QuestionBase<any>[];

  constructor(private questionControlService: QuestionControlService,
              private loadingService: LoadingService,
              private photoSelectDataService: PhotoModalDataService,
              private apiBaseService: ApiBaseService,
              private userService: UserService,
              private toastsService: ToastsService,
              private photoUploadService: PhotoUploadService) {
    this.closeObs$ = this.photoSelectDataService.closeObs$.merge(
      this.photoSelectDataService.dismissObs$, this.photoSelectDataService.openObs$);
  }

  ngOnInit() {
    if (!this.data) {
      this.data = new UserInfo();
    }
    if (this.nameOnly) {
      this.questions = [
        new TextboxQuestion({
          key: 'name',
          label: 'Name',
          value: this.data.name,
          required: true
        })
      ];
    } else {
      this.questions = [
        new TextboxQuestion({
          key: 'first_name',
          label: 'First Name',
          value: this.data.first_name,
          required: true
        }),

        new TextboxQuestion({
          key: 'last_name',
          label: 'Last Name',
          value: this.data.last_name,
          required: true
        }),

        new TextboxQuestion({
          key: 'nickname',
          value: this.data.nickname,
          label: 'Nickname'
        }),
      ];
    }
    this.form = this.questionControlService.toFormGroup(this.questions);
  }

  onOpenModal() {
    if (this.data.name && this.form.controls['name']) {
      this.form.controls['name'].setValue(this.data.name);
    }
    if (this.data.first_name && this.data.last_name && this.form.controls['first_name'] && this.form.controls['last_name']) {
      this.form.controls['first_name'].setValue(this.data.first_name);
      this.form.controls['last_name'].setValue(this.data.last_name);
    }
    if (this.data.nickname && this.form.controls['nickname']) {
      this.form.controls['nickname'].setValue(this.data.nickname);
    }
    this.modal.open();
  }


  onSubmit(values: any): void {
    if (values.name) {
      this.data.name = values.name;
    }

    if (values.first_name && values.last_name) {
      this.data.name = values.first_name + ' ' + values.last_name;
    }

    if (values.nickname) {
      this.data.nickname = values.nickname;
    }

    this.modal.close();
    this.eventOut.emit({action: 'update', item: 'info', data: values});
  }

  changeProfileImage(e: any) {
    let loadingId: string = '#profile_image';
    this.selectPhoto((photos: any) => {
      // Update avatar image
      let img_url = photos[0].url;
      this.data.profile_image = img_url;
      this.updateItem({'profile_image': img_url}, 'profile_image');
    }, loadingId);
  }

  selectPhoto(callback: any, loadingId?: string) {
    this.photoSelectDataService.open({'multipleSelect': false});
    this.nextPhotoSubscription = this.photoSelectDataService.nextObs$
      .take(1) // User can only select 1 photo to change profile avatar / cover image
      .takeUntil(this.closeObs$).subscribe(
        (photo: any) => {
          callback(photo);
        }, (err: any) => console.error('cover profile selectPhoto error: ', err));

    this.uploadPhotoSubscription = this.photoSelectDataService.uploadObs$
      .take(1)
      .takeUntil(this.closeObs$)
      .switchMap((photos: any) => {
        this.loadingService.start(loadingId);
        return this.photoUploadService.uploadPhotos(photos);
      })
      .subscribe(
        (res: any) => {
          callback([res.data]);
          this.loadingService.stop(loadingId);
        }, (err: any) => this.loadingService.stop(loadingId));
  }

  // this.loadingService.start();
  updateItem(body: any, updateItem?: any, callback?: any): void {
    this.onAction({'action': 'updateItem', 'body': body, 'updateItem': updateItem});

  }

  // Perform other events beside choose Photo actions
  onAction(event: any) {
    if (event.action == 'updateItem') {
      // Update profile via API call
      // this.apiBaseService.put('zone/social_network/users/update', body).take(1);
      this.apiBaseService.put('zone/social_network/users/update', event.body).take(1)
        .subscribe((result: any) => {
          console.log('update profile sucess: ', result);
          let toastMsg:string = '';
          if (_.has(event.body, 'profile_image')) {
            toastMsg = 'You have updated profile image successfully';
            // Update user profile
            if (this.userService.profile.uuid === _.get(result, 'data.uuid')) {
              Object.assign(this.userService.profile, {'profile_image': result.data.profile_image});
              Object.assign(this.userService.profile, {'profile_image': result.data.profile_image});
              this.userService.updateProfile(this.userService.profile);
            }
          }
          else if (_.has(event.body, 'cover_image')) {
                toastMsg = 'You have updated cover image of this community successfully';
          } else {
            toastMsg = result.message;
          }

          this.toastsService.success(toastMsg);
        });
    }
  }
}
