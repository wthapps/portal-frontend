import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiBaseService, UrlService } from '@shared/services';
import { Constants } from '@wth/shared/constant/config/constants';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { UserService } from '@wth/shared/services/user.service';
import { CountryService } from '@wth/shared/shared/components/countries/countries.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';

import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { MessageService } from 'primeng/api';

import { Subject } from 'rxjs';
import { BsModalComponent } from 'ng2-bs3-modal';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { PasswordConfirmationModalComponent } from '@shared/modals/password-comfirmation';

@Component({
  selector: 'my-setting-profile',
  templateUrl: 'profile.component.html'
})

export class MyProfileComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('passwordConfirmationModal') passwordConfirmationModal: PasswordConfirmationModalComponent;


  errorMessage = Constants.errorMessage.default;
  profile_image = '';

  sex = 0;

  yearRange: string;

  formValue: any;

  countriesCode: any;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  user_name: AbstractControl;
  email: AbstractControl;
  phone_prefix: AbstractControl;
  phone_number: AbstractControl;
  birthday: AbstractControl;

  changedEmailForm: FormGroup = new FormGroup({
    email: new FormControl ('', Validators.compose([Validators.required, CustomValidator.emailFormat]))
  });

  submitted = false;
  confirmedEmail: any = null;
  verified = false;
  phoneChanged = false;
  currentDate = new Date().toISOString().split('T')[0];

  checkTakenEmail$ = new Subject<string>();
  checkTakenUsername$ = new Subject<string>();

  checkCorrectPassword$ = new Subject<string>();


  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public userService: UserService,
              private fb: FormBuilder,
              private countryService: CountryService,
              private messageService: MessageService,
              private apiBaseService: ApiBaseService,
              private urlService: UrlService,
              private commonEventService: CommonEventService,
              private loadingService: LoadingService) {
    this.sex = this.userService.getSyncProfile().sex === null ? 0 : this.userService.getSyncProfile().sex;

    const d = new Date();
    const yearRangeEnd = d.getFullYear();
    const yearRangestart = yearRangeEnd - 100;
    this.yearRange = `${yearRangestart}:${yearRangeEnd}`;

    if (!this.userService.getSyncProfile().profile_image) {
      this.userService.getSyncProfile().profile_image = Constants.img.avatar;
    }

    let birthday: any = '';
    if (this.userService.getSyncProfile().birthday !== null) {
      birthday = new Date(this.userService.getSyncProfile().birthday);
    }

    this.form = fb.group({
      'first_name': [this.userService.getSyncProfile().first_name,
        Validators.compose([Validators.required, CustomValidator.blanked])
      ],
      'last_name': [this.userService.getSyncProfile().last_name,
        Validators.compose([Validators.required, CustomValidator.blanked])
      ],
      'user_name': [this.userService.getSyncProfile().user_name,
        Validators.compose([Validators.required, CustomValidator.blanked])
      ],
      'email': [
        { value: this.userService.getSyncProfile().email, disabled: true },
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'phone_prefix': [this.userService.getSyncProfile().nationality],
      'phone_number': [this.userService.getSyncProfile().phone_number],
      'birthday': [new Date(this.userService.getSyncProfile().birthday || null).toISOString().split('T')[0]]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.user_name = this.form.controls['user_name'];
    this.email = this.form.controls['email'];
    this.phone_prefix = this.form.controls['phone_prefix'];
    this.phone_number = this.form.controls['phone_number'];
    this.birthday = this.form.controls['birthday'];

    this.initializeChangedEmailForm();
  }

  ngOnInit(): void {
    // verified email
    if (this.urlService.getQuery() && this.urlService.getQuery().verified === 'true') {
      this.messageService.add({
        severity: 'success',
        summary: '',
        detail: 'You have successfully verify your email address'
      });
    }
    if (this.urlService.getQuery() && this.urlService.getQuery().verified === 'false') {
      this.messageService.add({
        severity: 'error',
        summary: '',
        detail: 'Cannot verify your email address. Please try again'
      });
    }
    this.apiBaseService.post('users/get_user').subscribe((res: any) => {
      this.confirmedEmail = res.data.confirmed_at;
    });
    // Set value before updating form (checking user leave this page)
    this.formValue = this.form.value;

    this.profile_image = this.userService.getSyncProfile().profile_image;
    this.countryService.getCountries().subscribe(
      (data: any) => this.countriesCode = data,
      (error: any) => this.errorMessage = <any>error);


    // verify taken email address

    this.checkTakenEmail$.pipe(
      debounceTime(Constants.searchDebounceTime),
      distinctUntilChanged(),
      switchMap((queryValue: any) => this.apiBaseService.get(`account/accounts/check_taken?key=email&value=${queryValue}`)))
      .subscribe((response: any) => {
          if (response.data.taken) {
            this.changedEmailForm.controls['email'].setErrors({taken: response.data.taken});
          }
        },
        (error: any) => {
          console.log('error', error);
        }
      );

    this.checkTakenUsername$.pipe(
      debounceTime(Constants.searchDebounceTime),
      distinctUntilChanged(),
      switchMap((queryValue: any) => this.apiBaseService.get(`account/accounts/check_taken?key=user_name&value=${queryValue}`)))
      .subscribe((response: any) => {
          if (response.data.taken) {
            this.form.controls['user_name'].setErrors({taken: response.data.taken});
          }
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

  onSubmit(values: any): void {
    const birthday_c = new Date(values.birthday);
    // console.log(birthday_c.getDate(), birthday_c.getMonth() + 1, birthday_c.getUTCFullYear());

    // Set value after updating form (checking user leave this page)
    this.formValue = values;

    this.submitted = true;

    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      values.sex = this.sex;

      const body = JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        user_name: values.user_name,
        nationality: values.phone_prefix,
        phone_number: values.phone_number,
        birthday: values.birthday,
        sex: values.sex
      });

      this.userService.update(body)
        .subscribe((result: any) => {
            // stop loading
            this.loadingService.stop();
            this.messageService.add({
              severity: 'success',
              summary: '',
              detail: 'Updated successfully'
            });
          },
          error => {
            // stop loading
            this.loadingService.stop();
            this.messageService.add({
              severity: 'error',
              summary: '',
              detail: this.errorMessage
            });
            console.log(error);
          }
        );
    }
  }

  sendVerifyEmail() {
    this.apiBaseService.post(`users/confirmation`).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: '',
        detail: 'A verification email was sent to your email address'
      });
    });
  }

  openChangeEmailModal() {
    this.initializeChangedEmailForm();
    this.modal.open();
  }

  closeChangeEmailModal() {
    this.modal.close();
  }

  openPasswordConfirmationModal() {
    this.closeChangeEmailModal();
    this.passwordConfirmationModal.open({email: this.userService.getSyncProfile().email});
  }

  checkTakenUsername(event: any) {

    const username = event.target.value.toString().trim();
    if (!this.form.controls.user_name.valid) {
      return;
    }
    this.checkTakenUsername$.next(username);
  }

  checkTakenEmail(event: any) {

    const keyword = event.target.value;
    if (!this.changedEmailForm.controls.email.valid) {
      return;
    }
    this.checkTakenEmail$.next(keyword);
  }

  changeEmail(payload: any) {
    this.passwordConfirmationModal.close();
    this.apiBaseService.post(`account/users/email/change`, {
      email: this.changedEmailForm.value.email,
      password: payload.password
    }).subscribe(response => {
      this.messageService.add({
        severity: 'success',
        summary: '',
        detail: 'You changed you email address successfully. A confirmation email sent out to new email address'
      });
    }, error => {
      this.messageService.add({
        severity: 'danger',
        summary: '',
        detail: 'You changed email address unsuccessfully'
      });
    });
  }

  onCompleteChange(country: any) {
    this.form.controls['phone_prefix'].setValue(country.code);
    this.phoneChanged = true;
  }

  private initializeChangedEmailForm() {
    // changed emaill form initialization
    this.changedEmailForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])]
    });
    this.changedEmailForm.markAsUntouched();
  }

}
