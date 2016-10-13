import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import {
  //2 LoadingService,
  //2 DialogService,
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
  card: CreditCard;

  constructor(private router: Router,
              //2 private dialogService: DialogService,
              private toastsService: ToastsService,
              //2 private loadingService: LoadingService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.selected_plan = JSON.parse(Cookie.get('selected_plan'));
    if (this.userService.profile.has_payment_info) {
      this.card = this.userService.profile.credit_cards[0];
    } else {
      this.card = new CreditCard({billing_address: new BillingAddress});
    }
  }

  confirm(): void {
    this.router.navigateByUrl('account/setting/profile');
  }

  upgrade(): void {

    let body: string = JSON.stringify({plan_id: this.selected_plan.id});

    //2
    /*this.dialogService.activate(
      'Confirm upgrading to ' + this.selected_plan.name + '. WTHApps will charged $' + this.selected_plan.price + ' per month', 'Update Plan'
    ).then((responseOK) => {
      if (responseOK) {
        //2 this.loadingService.start();
        this.userService.choosePlan(`users/${this.userService.profile.id}`, body)
          .subscribe((response: any) => {
              this.upgraded = true;
              this.toastsService.success(response.message);
              //2 this.loadingService.stop();
            },
            error => {
              this.toastsService.danger(error);
              //2 this.loadingService.stop();
            });
      }
    });*/
  }

  updateCard(): void {
    this.router.navigate(['/account/payment']);
  }
}
