import {Component, OnInit, ViewChild} from '@angular/core';
import { ApiBaseService, AuthService } from '@shared/services';
import { SubscriptionService } from '@shared/common/subscription/subscription.service';
import { StorageService } from '@shared/common/storage';
import { PaymentMethodService } from '@account/payment/payment-method/payment-method.service';
import { PlanService } from '@shared/common/plan';
import { Router } from '@angular/router';
import { SubscriptionCancelModalComponent } from '@account/payment/subscription/modal/subscription-cancel-modal.component';
import { PasswordConfirmationModalComponent } from '@shared/modals/password-comfirmation';
import {ToastsService} from "@shared/shared/components/toast/toast-message.service";

declare let moment: any;

@Component({
  selector: 'current-subscription',
  templateUrl: 'current-subscription.component.html'
})

export class CurrentSubscriptionComponent implements OnInit {
  @ViewChild('cancelModal') cancelModal: SubscriptionCancelModalComponent;
  @ViewChild('passwordConfirmationModal') passwordConfirmationModal: PasswordConfirmationModalComponent;

  editing;
  subscription: any;
  plan: any;
  storage: any;
  paymentMethod: any;

  readonly TRIALING = 'TRIALING';
  readonly CANCELING = 'CANCELING';

  constructor(
    private router: Router,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private planService: PlanService,
    private storageService: StorageService,
    private paymentMethodService: PaymentMethodService,
    private toastsService: ToastsService
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
    this.cancelModal.open();
  }

  openPasswordConfirmation(confirmed: boolean) {
    this.passwordConfirmationModal.open({ email: this.authService.user.email });
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
        `You continued your subscription successful.</br>You can use until 12/12/2019`);
    }, error => {
      this.toastsService.danger(
        'Continue subscription',
        `Continuing subscription failed.</br>${error.error.error}`);
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
  }

  private gotoSubscriptionAlert(success: boolean) {
    this.router.navigate(['payment/subscription/alert'], {
      queryParams: { alertType: 'canceling', success: success }}
    ).then();
  }

}
