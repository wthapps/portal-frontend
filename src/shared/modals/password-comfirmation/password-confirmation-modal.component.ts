import { Component, ViewChild, Input, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiBaseService } from '@wth/shared/services';
import { Constants } from '@shared/constant';
import { Confirmation } from 'primeng/components/common/confirmation';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'w-password-confirmation-modal',
  styleUrls: ['password-confirmation-modal.component.scss'],
  templateUrl: 'password-confirmation-modal.component.html'
})

export class PasswordConfirmationModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('wrongPasswordModal') wrongPasswordModal: BsModalComponent;
  @Input() email: any;

  sub: any;
  attemptsFailed = 0;
  readonly retryTimes = 3;

  readonly forgotPasswordUrl = `${Constants.baseUrls.app}/recovery/forgottenpassword`;
  passwordConfirmationForm: FormGroup;

  confirmation: Confirmation;


  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {

  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  open(options?: any) {
    if (options) {
      this.email = options.email;
      this.confirmation = options;

      if (this.confirmation.accept) {
          this.confirmation.acceptEvent = new EventEmitter();
          this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
      }

      if (this.confirmation.reject) {
          this.confirmation.rejectEvent = new EventEmitter();
          this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
      }
    }
    this.initializeForm();

    // TODO: Check last confirm password attempt time in local storage. After x time, allow user to confirm password again.
    if(true) {
      this.attemptsFailed = 0;
      this.modal.open();
      this.wrongPasswordModal.close();
    } else {
      this.close();
    }
  }

  close() {
    this.modal.close();
    this.wrongPasswordModal.close();

    if (this.confirmation.reject) {
      this.confirmation.rejectEvent.emit();
    }
  }

  submit(values) {
    this.apiBaseService.post(`account/accounts/check_password`, {
      email: this.email,
      password: values.password
    }).subscribe(response => {
      this.close();
      if (this.confirmation.acceptEvent) {
        this.confirmation.acceptEvent.emit({password: values.password});
      }
    }, (errorCode: HttpErrorResponse) => {
      if (errorCode.error.error === "Invalid password") {

        this.attemptsFailed++;
        if(this.attemptsFailed >= this.retryTimes) {
          // TODO: Store last attempts time in local device. Make sure user can only retry after x times.
          this.modal.close();
          this.wrongPasswordModal.open();
        }
        this.passwordConfirmationForm.controls['password'].setErrors({notMatched: true});
      }

    });
  }


  toggleShowingPassword(event: any): void {
    const icon = event.target || event.srcElement || event.currentTarget;
    const password = document.getElementById('password');
    if (password.getAttribute('type') === 'password') {
      password.setAttribute('type', 'text');
      icon.classList.add('active');
    } else {
      password.setAttribute('type', 'password');
      icon.classList.remove('active');
    }
  }

  private initializeForm() {
    // password confirmation form initialization
    this.passwordConfirmationForm = this.fb.group({
      'password': ['', Validators.compose([Validators.required])]
    });
  }
}
