import { Component, OnInit } from '@angular/core';

import { UserService } from '@shared/services';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'user-alert',
  templateUrl: 'user-alert.component.html',
  styleUrls: ['user-alert.component.scss']
})
export class UserAlertComponent implements OnInit {
  title = '';
  message = '';
  subscription: any;
  success = false;

  alertType: 'complete_signup';

  readonly COMPLETE_SIGNUP = 'complete_signup';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.alertType = params.alertType || this.COMPLETE_SIGNUP;
      this.success = params.success === 'false' ? false : true;
      this.setContent(this.alertType);
    });
  }

  sendVerificationEmail() {
    this.userService.sendConfirmationEmail().subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Verification email resent',
        detail: 'A verification email was resent to your email address successful'
      });
    });
  }

  private setContent(alertType: string) {
    switch (alertType) {
      case this.COMPLETE_SIGNUP:
        this.title = 'Thank you for signing up';
        this.message = `<p>An email has been sent to ${this.userService.getSyncProfile().email}. It may take a few minutes or less.
                        Follow the instruction that you receive from WTH!Apps to complete the sign up process.
                        </p>
                        <p>You may resend the email by click on the button below.</p>`;
        break;
    }
  }
}
