import {Component, OnInit, ViewChild} from '@angular/core';

import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { SubscriptionCancelModalComponent } from '@account/payment/subscription/modal/subscription-cancel-modal.component';
import { PasswordConfirmationModalComponent } from '@shared/modals/password-comfirmation';
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";
import { AuthService, WthConfirmService, UserService } from '@shared/services';
import { SubscriptionService } from '@shared/common/subscription';
import { Constants } from '@shared/constant';
import { AccountService } from '@account/shared/account/account.service';
import { PaymentMethodAddModalComponent } from '@account/payment/payment-method/payment-method-add-modal.component';

@Component({
  selector: 'current-subscription',
  templateUrl: 'current-subscription.component.html'
})

export class CurrentSubscriptionComponent implements OnInit {
  @ViewChild('cancelModal') cancelModal: SubscriptionCancelModalComponent;
  @ViewChild('passwordConfirmationModal') passwordConfirmationModal: PasswordConfirmationModalComponent;
  @ViewChild('addModal') addModal: PaymentMethodAddModalComponent;


  editing;
  subscription: any;
  plan: any;
  storage: any;
  paymentMethod: any;
  mode: 'add' | 'edit';

  readonly TRIALING = 'TRIALING';
  readonly CANCELING = 'CANCELING';
  readonly ACTIVATING = 'ACTIVATING';
  readonly DELETED_DAY_NUM = 60;

  constructor(
    private router: Router,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private wthConfirm: WthConfirmService,
    private userService: UserService,
    private accountService: AccountService,
    private toastsService: ToastsService,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit() {
    this.getCurrentSubscription();
  }

  getCurrentSubscription() {
    this.subscriptionService.getCurrent().subscribe(response => {
        this.updateCurrentSubscriptionValues(response.data.attributes);
      }
    );
  }

  upgradeSubscription() {
    this.router.navigate(['payment/subscription/upgrade']);
  }

  openCancelSubscriptionConfirmation() {
    this.cancelModal.open({subscription: this.subscription, deletedDayNum: this.DELETED_DAY_NUM });
    this.cancelModal.onNext.pipe(
      take(1)
    ).subscribe(_ => {
      this.passwordConfirmationModal.open({ email: this.authService.user.email,
        accept: () =>  {
        this.cancelSubscription();
        }});
    });

  }

  cancelSubscription() {
    this.subscriptionService.cancel(this.subscription).subscribe(response => {
      this.updateCurrentSubscriptionValues(response.data.attributes);
      this.gotoSubscriptionAlert(true);
    }, error => {
      this.toastsService.danger(
        'Cancel subscription',
        `Canceling subscription failed.</br>${error.error.error}`);
    });
  }

  continueSubscription() {
    this.subscriptionService.continue(this.subscription).subscribe(response => {
      this.updateCurrentSubscriptionValues(response.data.attributes);
      this.toastsService.success(
        'Continue subscription',
        `You continued your subscription successful.<br/>
                You can use until ${ this.datePipe.transform(this.subscription.ended_bc_at, 'MMM dd yyyy') }`);
    }, error => {
      this.toastsService.danger(
        'Continue subscription',
        `Continuing subscription failed.</br>${error.error.error}`);
    });
  }

  openPaymentMethodModal() {
    this.addModal.open({mode: this.mode});
  }

  savePaymentMethod(response: any) {
    const action = this.mode === 'add' ? 'added' : 'changed';

    if (response.success) {
      this.paymentMethod = response.data;
      this.toastsService.success(
        `Payment method ${ action }`,
        `You ${ action } payment method successfully`
      );
    } else if (response.error) {
      this.toastsService.danger(
        `Payment method ${ action } error`,
        `${response.error}`
      );
    }
  }

  deleteAccount() {
    const faqUrl = `${Constants.baseUrls.app}/faq`;
    this.wthConfirm.confirm({
      acceptLabel: 'Delete account',
      rejectLabel: 'Cancel',
      message: `<p>Please make sure you reallly want to delete your account.</p>

      <p>By pressing 'Delete Account' your account and all data will be deleted permanently and it cannot be restored.</p>

      <p>Before you press the 'Delete account' button below - make sure you have downloaded all your data, files, notes, pictures, etc. </p>

      <p>We CANNOT restore your data or account once you delete your account.</p>

      <p>If you insist to continue, please remember to download all of your important data beforehand.
       We can't restore your account and data once it is deleted. </p>

      <p> We do not provide refunds for your remaining subscription.</p>

      <p>Check out our <a href="${faqUrl}">FAQ page</a> for more details on shared data and how this data is treated when you delete your account.</p>

      `,
      header: 'Delete account',
      accept: () => {
        this.passwordConfirmationModal.open({ email: this.authService.user.email,
          accept: () =>  {
            const user = this.userService.getSyncProfile();
            this.accountService.delete(user.uuid).toPromise()
            .then(() => this.router.navigate(['/account-deleted'], {queryParams: {email: user.email}}))
            .then(() => this.userService.deleteUserInfo())
            ;
          }});
      }
    });
  }

  viewStorageDetail() {

  }

  upgradeStorage() {

  }

  private updateCurrentSubscriptionValues(subscription: any) {
    this.subscription = subscription;
    this.plan = subscription.plan;
    this.storage = subscription.storage;
    this.paymentMethod = subscription.payment_method;
    this.mode = this.paymentMethod ? 'edit' : 'add';
  }

  private gotoSubscriptionAlert(success: boolean) {
    this.router.navigate(['payment/subscription/alert'], {
      queryParams: { alertType: 'canceling', success: success }}
    ).then();
  }

}
