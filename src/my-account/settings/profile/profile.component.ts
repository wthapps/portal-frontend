import { Component, OnInit, ViewChild, OnDestroy }    from '@angular/core';
import 'rxjs/add/observable/fromPromise';
import { Subject } from 'rxjs/Subject';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { UserService } from '@wth/shared/services/user.service';
import { CountryService } from '@wth/shared/shared/components/countries/countries.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { UploadCropImageComponent } from '@wth/shared/shared/components/upload-crop-image/upload-crop-image.component';
import { PhotoModalDataService } from '@wth/shared/services/photo-modal-data.service';
import { PhotoUploadService } from '@wth/shared/services/photo-upload.service';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { Constants } from '@wth/shared/constant/config/constants';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'my-setting-profile',
  templateUrl: 'profile.component.html'
})

export class MyProfileComponent implements OnInit, OnDestroy {
  // @ViewChild('uploadProfile') uploadProfile: UploadCropImageComponent;

  pageTitle: string = 'Profile';
  errorMessage: string = Constants.errorMessage.default;
  defaultAvatar: string = Constants.img.avatar;
  profile_image: string = '';

  sex: number = 0;
  birthdayDate: any = {
    day: 0,
    month: 0,
    year: 0
  };

  formValue: any;

  countriesCode: any;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  phone_prefix: AbstractControl;
  phone_number: AbstractControl;
  birthday_day: AbstractControl;
  birthday_month: AbstractControl;
  birthday_year: AbstractControl;

  validDays: number[] = [];
  // validMonths: number[] = [];
  validYears: number[] = [];
  submitted: boolean = false;
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public userService: UserService,
              private fb: FormBuilder,
              private countryService: CountryService,
              private toastsService: ToastsService,
              // private photoSelectDataService : PhotoModalDataService,
              // private photoUploadService: PhotoUploadService,
              private commonEventService: CommonEventService,
              private loadingService: LoadingService) {

    this.sex = this.userService.getSyncProfile().sex === null ? 0 : this.userService.getSyncProfile().sex;
    this.validDays = this.range(1, 31);
    this.validYears = this.range(2016, 1905);

    if (!this.userService.getSyncProfile().profile_image) {
      this.userService.getSyncProfile().profile_image = Constants.img.avatar;
    }

    if (this.userService.getSyncProfile().birthday !== null) {
      let birthday = new Date(this.userService.getSyncProfile().birthday);
      this.birthdayDate.day = birthday.getDate();
      this.birthdayDate.month = birthday.getMonth() + 1;
      this.birthdayDate.year = birthday.getUTCFullYear();
    }

    this.form = fb.group({
      'first_name': [this.userService.getSyncProfile().first_name,
        Validators.compose([Validators.required])
      ],
      'last_name': [this.userService.getSyncProfile().last_name,
        Validators.compose([Validators.required])
      ],
      'email': [
        {value: this.userService.getSyncProfile().email, disabled: true},
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'phone_prefix': [this.userService.getSyncProfile().nationality],
      'phone_number': [this.userService.getSyncProfile().phone_number],
      'birthday_day': [this.birthdayDate.day],
      'birthday_month': [this.birthdayDate.month],
      'birthday_year': [this.birthdayDate.year]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.phone_prefix = this.form.controls['phone_prefix'];
    this.phone_number = this.form.controls['phone_number'];
    this.birthday_day = this.form.controls['birthday_day'];
    this.birthday_month = this.form.controls['birthday_month'];
    this.birthday_year = this.form.controls['birthday_year'];
  }

  ngOnInit(): void {
    // Set value before updating form (checking user leave this page)
    this.formValue = this.form.value;

    this.profile_image = this.userService.getSyncProfile().profile_image;
    this.countryService.getCountries().subscribe(
      (data: any) => this.countriesCode = data,
      (error: any) => this.errorMessage = <any>error);
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

  onSubmit(values: any): void {
    // Set value after updating form (checking user leave this page)
    this.formValue = values;

    this.submitted = true;

    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      values.sex = this.sex;

      let body = JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        nationality: values.phone_prefix,
        phone_number: values.phone_number,
        birthday_day: values.birthday_day.toString(),
        birthday_month: values.birthday_month.toString(),
        birthday_year: values.birthday_year.toString(),
        sex: values.sex
      });

      //console.log(body);

      this.userService.update(body)
        .subscribe((result: any) => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.success(result.message);
          },
          error => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.danger(this.errorMessage);
            console.log(error);
          }
        );
    }
  }

  uploadImage(event: any): void {
    event.preventDefault();
    // this.uploadProfile.modal.open();
    this.commonEventService.broadcast({channel: 'SELECT_CROP_EVENT', action: 'SELECT_CROP:OPEN', payload: {currentImage: this.userService.getSyncProfile().profile_image} });
    this.handleSelectCropEvent();
  }

  handleSelectCropEvent() {
    this.commonEventService.filter((event: any) => event.channel == 'SELECT_CROP_EVENT')
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });
  }


  doEvent(event: any) {
    // console.log(event);
    switch (event.action) {
      case 'SELECT_CROP:DONE':
        console.debug('inside doEvent - SELECT_CROP:DONE', event);
        // Change user profile
        this.updateProfileImageBase64(event.payload);
        break;
      default:
        break;
    }
  }

  updateProfileImageBase64(img: string): void {
    this.updateUser(JSON.stringify({image: img}));
  }

  private updateUser(body: string): void {
    this.userService.update(body)
      .subscribe((result: any) => {
          // stop loading
          this.loadingService.stop();
          this.toastsService.success(result.message);

        //  reload profile image
          $('img.lazyloaded').addClass('lazyload');
        },
        error => {
          // stop loading
          this.loadingService.stop();
          this.toastsService.danger(this.errorMessage);
          console.log(error);
        }
      );
  }

  private range (start: number, end: number) {
    let f: number = (end > start) ? start : end;
    let res: number[] = Array.from(Array(Math.abs(end - start) + 1).keys()).map((i: number) => { return i + f;})
    return (end > start) ? res : res.reverse();
  };


  /**
   *
   * @returns {boolean|Promise<boolean>}
   */
  //2 canDeactivate(): Promise<boolean> | boolean {
  //   return this.deactivateConfirmService.activate(this.formValue, this.form.value);
  // }
}
