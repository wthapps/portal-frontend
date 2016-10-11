import {Component, OnInit}                    from '@angular/core';
import {Router, ROUTER_DIRECTIVES}            from '@angular/router';
import { Cookie }                             from 'ng2-cookies/ng2-cookies';

import {
  UserService,
  LoadingService,
  DialogService,
  ToastsService
}                                     from '../../shared/index';
import {CreditCard}                   from '../../shared/models/credit-card.model';
import {BillingAddress}               from '../../shared/models/billing-address.model';

@Component({
  moduleId: module.id,
  templateUrl: 'payment-confirm.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class PaymentConfirmComponent implements OnInit {
  PanelTitle:string = 'Confirm Your Purchase';
  selected_plan: any = null;
  upgraded: boolean = false;
  card: CreditCard;

  constructor(
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private toastsService: ToastsService,
    private loadingService: LoadingService
  ) {
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

   this.dialogService.activate(
   'Confirm upgrading to ' + this.selected_plan.name + '. WTHApps will charged $' + this.selected_plan.price + ' per month', 'Update Plan'
   ).then((responseOK) => {
     if (responseOK) {
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
