import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { CreditCard } from '@wth/shared/shared/models/credit-card.model';

import { UserService } from '@wth/shared/services/user.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { PaymentMethodAddModalComponent } from './payment-method-add-modal.component';
import { PaymentMethodService } from '@account/billing/payment-method/payment-method.service';

@Component({
  selector: 'payment-method-list',
  templateUrl: 'payment-method-list.component.html',
  styleUrls: ['payment-method-list.component.scss']
})

export class PaymentMethodListComponent implements OnInit {
  @ViewChild('addModal') addModal: PaymentMethodAddModalComponent;

  pageTitle = 'Payment methods';
  paymentMethod: any;
  loaded = false;
  mode: 'add' | 'edit';

  constructor(public userService: UserService,
              private wthConfirmService: WthConfirmService,
              private toastsService: ToastsService,
              private paymentMethodService: PaymentMethodService
              ) {
  }

  ngOnInit(): void {
    // Get current payment methods
    this.paymentMethodService.getCurrent().subscribe(response => {
      this.paymentMethod = response.data;
      this.loaded = true;
    });
    this.mode = this.paymentMethod ? 'edit' : 'add';
  }

  openModal() {
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
}
