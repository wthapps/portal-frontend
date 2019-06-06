import { Component, AfterViewInit, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@shared/services/user.service';
import { Constants } from '@shared/constant/config/constants';
import { PaymentMethodAddModalComponent } from '@account/payment/payment-method/payment-method-add-modal.component';
import { PaymentMethodService } from '@account/payment/payment-method/payment-method.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { StorageService } from '@shared/common/storage';
import { SubscriptionService } from '@shared/common/subscription/subscription.service';
import { SubscriptionAlertModalComponent } from '@account/payment/subscription/subscription-alert-modal.component';

@Component({
  selector: 'subscription-upgrade',
  templateUrl: 'subscription-upgrade.component.html'
})
export class SubscriptionUpgradeComponent implements OnInit {
  @ViewChild('addModal') addModal: PaymentMethodAddModalComponent;
  @ViewChild('alertModal') alertModal: SubscriptionAlertModalComponent;

  submitted: boolean = false;

  plan: any;
  currentStorage: any;
  selectedStorage: any;
  selectedStorageId: number;
  storages: Array<any> = [];
  paymentMethod: any;
  mode: 'add' | 'edit';
  checked: false;
  subscription: any;

  readonly termsOfServiceUrl = Constants.baseUrls.app + '/policies/terms';

  constructor(
    private router: Router,
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private paymentMethodService: PaymentMethodService,
    private storageService: StorageService,
    private toastsService: ToastsService
  ) {}

  ngOnInit(): void {
    // Get storage list
    this.storageService.getAll().subscribe(response => {
      this.storages = response.data;
    });

    this.subscriptionService.getCurrent().subscribe(response => {
      this.subscription = response.data.attributes;
      this.plan = this.subscription.plan;
      this.currentStorage = this.subscription.storage;
      this.selectedStorage = this.subscription.storage;
      this.paymentMethod = this.subscription.payment_method;
      this.selectedStorageId = this.currentStorage.id;
      this.mode = this.paymentMethod ? 'edit' : 'add';
    });
  }

  onSubmit() {
    this.submitted = true;
  }

  openPaymentMethodModal() {
    this.addModal.open({mode: this.mode});
  }

  savePaymentMethod(response: any) {
    if (response.success) {
      this.paymentMethod = response.data;
      this.toastsService.success(`You ${ this.mode === 'add' ? 'added' : 'changed' } payment method successfully`);
    } else if (response.error) {
      this.toastsService.danger(`'Error found after you ${ this.mode === 'add' ? 'added' : 'changed' } payment method'`);
    }
  }

  selectStorage(storage: any) {
    this.selectedStorage = storage;
  }

  upgrade() {
    const subscription = {
      plan_id: this.plan.id || null,
      storage_id: this.selectedStorage.id,
      payment_method_id: this.paymentMethod.id
    };
    this.subscriptionService.upgrade(subscription).subscribe(response => {
      this.gotoSubscriptionAlert(true);
    }, error => {
      this.alertModal.open();
    });
  }

  private gotoSubscriptionAlert(success: boolean) {
    this.router.navigate(['payment/subscription/alert'], {
      queryParams: { alertType: 'upgrading', success: success }}
    ).then();
  }

}
