import { Component, OnInit }            from '@angular/core';

import { CookieService, CookieOptions } from 'ngx-cookie';

import { CreditCard } from '@wth/shared/shared/models/credit-card.model';
import { BillingAddress } from '@wth/shared/shared/models/billing-address.model';

import { UserService } from '@wth/shared/services/user.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant/config/constants';

@Component({
  moduleId: module.id,
  selector: 'my-payment-method',
  templateUrl: 'payment-method.component.html'
})

export class PaymentMethodComponent implements OnInit {
  pageTitle: string = 'Payment method';
  credit_card: CreditCard;

  private cookieOptionsArgs: CookieOptions = {
    path: '/',
    domain: Constants.baseUrls.domain,
    expires: new Date('2030-07-19')
  };

  constructor(public userService: UserService,
              private loadingService: LoadingService,
              private wthConfirmService: WthConfirmService,
              private toastsService: ToastsService,
              private cookieService: CookieService) {
    //console.log(this.userService);
  }

  ngOnInit(): void {
    if (this.userService.getSyncProfile().has_payment_info) {
      this.credit_card = this.userService.getSyncProfile().credit_cards[0];
    } else {
      this.credit_card = new CreditCard({billing_address: new BillingAddress});
    }
  }

  /*onEdit(event: any): void {
   event.preventDefault();
   this.router.navigateByUrl(
   `/account/payment;operation=edit;${Constants.params.next}=${this.router.location.path().replace(/\//g, '\%20')}`
   );
   }*/

  onDelete(event: any): void {
    event.preventDefault();

    this.wthConfirmService.confirm({
      message: 'Are you sure to delete Billing details?',
      header: 'Delete billing details',
      accept: () => {
        this.loadingService.start();
        this.userService.update(`/users/${this.userService.getSyncProfile().id}/payments/1`).subscribe(
          response => {
            this.loadingService.stop();
            this.toastsService.success('The billing details has been deleted.');
            this.userService.getSyncProfile().has_payment_info = false;
            this.userService.getSyncProfile().credit_cards = null;
            // Cookie.delete('profile');
            this.cookieService.put('profile', JSON.stringify(this.userService.getSyncProfile()), this.cookieOptionsArgs);
          },
          error => {
            this.loadingService.stop();
            this.toastsService.danger('Unable to delete the billing details.');
          }
        );
      }
    });
  }
}
