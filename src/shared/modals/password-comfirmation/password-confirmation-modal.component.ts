import { Component, ViewChild, Input, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@wth/shared/services';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'w-password-confirmation-modal',
  styleUrls: ['password-confirmation-modal.component.scss'],
  templateUrl: 'password-confirmation-modal.component.html'
})

export class PasswordConfirmationModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('wrongPasswordModal') wrongPasswordModal: BsModalComponent;  
  @Input() email: any;
  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBack: EventEmitter<any> = new EventEmitter<any>();

  sub: any;
  attemptsFailed = 0;
  readonly retryTimes = 3;

  passwordConfirmationForm: FormGroup;


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
    }
    this.initializeForm();

    // TODO: Check last confirm password attempt time in local storage. After x time, allow user to confirm password again.
    if(true) {
      this.attemptsFailed = 0;
      this.modal.open();
      this.wrongPasswordModal.close();
    } else {
      this.modal.close();
      this.wrongPasswordModal.close();
    }
  }

  close() {
    this.modal.close();
    this.wrongPasswordModal.close();
  }

  submit(values) {
    this.apiBaseService.post(`account/accounts/check_password`, {
      email: this.email,
      password: values.password
    }).subscribe(response => {
      this.close();
      this.onNext.emit({password: values.password});
    }, error => {
      // TODO: Check error code, make sure only 'Invalid password' error is catched
      this.attemptsFailed++;
      if(this.attemptsFailed >= this.retryTimes) {
        // TODO: Store last attempts time in local device. Make sure user can only retry after x times.
        this.modal.close();
        this.wrongPasswordModal.open();
      }

      this.passwordConfirmationForm.controls['password'].setErrors({notMatched: true});
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
