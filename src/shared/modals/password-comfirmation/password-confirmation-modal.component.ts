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
  @Input() email: any;
  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBack: EventEmitter<any> = new EventEmitter<any>();

  sub: any;
  sub2: any;

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
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  submit(values) {
    this.apiBaseService.post(`account/accounts/check_password`, {
      email: this.email,
      password: values.password
    }).subscribe(response => {
      this.modal.close();
      this.onNext.emit({password: values.password});
    }, error => {
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
