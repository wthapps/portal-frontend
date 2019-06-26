import { Component, OnInit } from '@angular/core';

import { UserService } from '@shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@shared/constant';
import { MessageService } from 'primeng/api';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'user-email-confirmation',
  templateUrl: 'confirmation.component.html',
  styleUrls: ['confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  confirmed = false;

  readonly dashboard = Constants.baseUrls.myAccount + '/dashboard';
  readonly faqUrl = Constants.baseUrls.app + '/faq';
  readonly profileUrl = Constants.baseUrls.myAccount + '/settings/profile';
  loginUrl = Constants.baseUrls.myAccount + '/settings/profile';

  alertType: string;
  iconClass = '';
  title = '';
  message = '';

  SUCCESSFUL = 'SUCCESSFUL';
  CONFIRMED = 'CONFIRMED';
  FAILED = 'FAILED';
  LOGIN_REQUIRED = 'LOGIN_REQUIRED';

  status: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    // if (!this.userService.getSyncProfile()) {
    //   this.setContent(this.LOGIN_REQUIRED);
    //   return;
    // }

    this.route.queryParams.subscribe(params => {
      const token = params.t;
      if (token === 'undefined') {
        this.confirmed = false;
        // this.toastsService.danger('Invalid confirmation to confirm your email address');
      } else {
        this.userService.confirmEmail(token).subscribe(response => {
          this.status = this.SUCCESSFUL;
          this.setContent(this.SUCCESSFUL);
        }, error => {
          const message = error.error.error;
          this.status = (error.error.status === 422) ? this.CONFIRMED : this.FAILED;
          this.setContent(this.status, message);
        });
      }
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

  goToLogin() {
    // window.location.href = `${Constants.baseUrls.app}/login?returnUrl=${location.href}`;
    // this.router.navigateByUrl(`${Constants.baseUrls.app}/login?returnUrl=${location.href}`);
  }

  private setContent(alertType: string, message?: string) {
    switch (alertType) {
      case this.SUCCESSFUL:
        this.iconClass = 'fa-check-circle-o icon-success';
        this.title = 'Email verification successful';
        this.message = `<p>Your email address has been confirmed and your account is successfully verified.</p>
                        <p>If you have any questions, please visit <a [href]="${ this.faqUrl }">FAQs</a>.</p>
                        <p>Or click on the button below and redirect to WTH!Apps.</p>`;
        break;
      case this.CONFIRMED:
        this.iconClass = 'fa-envelope-o icon-error';
        this.title = 'Email verification failed';
        this.message = `<p>Your email address already confirmed</p>
                        <p>Click on the button below and redirect to WTH!Apps.</p>`;
        break;
      case this.FAILED:
        this.iconClass = 'fa-times-circle-o icon-error';
        this.title = 'Email verification failed';
        this.message = `<p>${ message }</p>
                        <p>Click on the button below to resend.</p>`;
        break;
      case this.LOGIN_REQUIRED:
        this.iconClass = 'fa-exclamation-circle icon-error';
        this.title = 'Login required';
        this.message = `<p>You need to login to finish email verification process</p>;
                        <p>Click on the button below for logging in.</p>`;
        break;
    }
  }
}
