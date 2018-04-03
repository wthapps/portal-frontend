import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { UserService } from '@wth/shared/services/user.service';
import { CreditCard } from '@wth/shared/shared/models/credit-card.model';
import { BillingAddress } from '@wth/shared/shared/models/billing-address.model';

@Component({
  moduleId: module.id,
  templateUrl: 'payment-confirm.component.html'
})
export class MyPaymentConfirmComponent implements OnInit {
  PanelTitle: string = 'Confirm Your Purchase';
  selected_plan: any = null;
  upgraded: boolean = false;
  // card: CreditCard;
  card: any; // TODO: Refractor later

  constructor(
    private router: Router,
    private toastsService: ToastsService,
    private wthConfirmService: WthConfirmService,
    private loadingService: LoadingService,
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.selected_plan = JSON.parse(this.cookieService.get('selected_plan'));

    if (this.userService.getSyncProfile().has_payment_info) {
      // this.card = this.userService.getSyncProfile().credit_cards[0];
      if (this.userService.defaultPayment.payment_type == 'creditcard') {
        this.card = this.userService.defaultPayment;
      } else {
        this.card = new CreditCard({ billing_address: new BillingAddress() });
      }
    } else {
      this.card = new CreditCard({ billing_address: new BillingAddress() });
    }
  }

  confirm(): void {
    this.router.navigateByUrl('account/settings/profile');
  }

  upgrade(): void {
    let body: string = JSON.stringify({ plan_id: this.selected_plan.id });

    this.wthConfirmService.confirm({
      message:
        'Confirm upgrading to ' +
        this.selected_plan.name +
        '. WTHApps will charged $' +
        this.selected_plan.price +
        ' per month',
      header: 'Update Plan',
      accept: () => {
        this.loadingService.start();
        this.userService
          .choosePlan(`users/${this.userService.getSyncProfile().id}`, body)
          .subscribe(
            (response: any) => {
              this.upgraded = true;
              this.toastsService.success(response.message);
              this.loadingService.stop();
            },
            error => {
              this.toastsService.danger(error);
              this.loadingService.stop();
            }
          );
      }
    });
  }

  updateCard(): void {
    this.router.navigate(['/account/payment']);
  }
}
