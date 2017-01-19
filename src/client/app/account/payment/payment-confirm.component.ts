import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import {
  LoadingService,
  ConfirmationService,
  ToastsService,
  UserService
} from '../../shared/index';
import { CreditCard } from '../../shared/models/credit-card.model';
import { BillingAddress } from '../../shared/models/billing-address.model';

@Component({
  moduleId: module.id,
  templateUrl: 'payment-confirm.component.html'
})

export class PaymentConfirmComponent implements OnInit {
  PanelTitle: string = 'Confirm Your Purchase';
  selected_plan: any = null;
  upgraded: boolean = false;
  // card: CreditCard;
  card: any; // TODO: Refractor later

  constructor(private router: Router,
              private toastsService: ToastsService,
              private confirmationService: ConfirmationService,
              private loadingService: LoadingService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.selected_plan = JSON.parse(Cookie.get('selected_plan'));
    if (this.userService.profile.has_payment_info) {
      // this.card = this.userService.profile.credit_cards[0];
      if ( this.userService.defaultPayment.payment_type == 'creditcard')
        this.card = this.userService.defaultPayment;
      else
        this.card = new CreditCard({billing_address: new BillingAddress});
    } else {
      this.card = new CreditCard({billing_address: new BillingAddress});
    }
  }

  confirm(): void {
    this.router.navigateByUrl('account/setting/profile');
  }

  upgrade(): void {

    let body: string = JSON.stringify({plan_id: this.selected_plan.id});

    this.confirmationService.confirm({
      message: 'Confirm upgrading to ' + this.selected_plan.name + '. WTHApps will charged $' + this.selected_plan.price + ' per month',
      header: 'Update Plan',
      accept: () => {
        this.loadingService.start();
        this.userService.choosePlan(`users/${this.userService.profile.id}`, body)
          .subscribe((response: any) => {
              this.upgraded = true;
              this.toastsService.success(response.message);
              this.loadingService.stop();
            },
            error => {
              this.toastsService.danger(error);
              this.loadingService.stop();
            });
      }
    });
  }

  updateCard(): void {
    this.router.navigate(['/account/payment']);
  }
}
