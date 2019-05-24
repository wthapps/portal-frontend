import { Component, AfterViewInit, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@shared/services/user.service';
import { Constants } from '@shared/constant/config/constants';
import { PaymentMethodAddModalComponent } from '@account/payment/payment-method/payment-method-add-modal.component';
import { PaymentMethodService } from '@account/payment/payment-method/payment-method.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

@Component({
  selector: 'subscription-upgrade',
  templateUrl: 'subscription-upgrade.component.html'
})
export class SubscriptionUpgradeComponent implements AfterViewInit, OnInit {
  @ViewChild('addModal') addModal: PaymentMethodAddModalComponent;

  submitted: boolean = false;

  val1: any;
  paymentMethod: any;
  mode: 'add' | 'edit';

  constructor(
    private router: Router,
    private userService: UserService,
    private paymentMethodService: PaymentMethodService,
    private toastsService: ToastsService
  ) {}

  ngOnInit(): void {
// Get current payment methods
    this.paymentMethodService.getCurrent().subscribe(response => {
      this.paymentMethod = response.data;
      this.mode = this.paymentMethod ? 'edit' : 'add';
    });
  }

  ngAfterViewInit() {


  }

  changePaymentMethod(element: any) {
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

  upgrade() {
    this.router.navigate(['payment/subscription/alert'], {
      queryParams: { alertType: 'upgrading', success: false }}
    ).then();
  }

}
