import {Component}            from '@angular/core';
import {
  Router,
  ROUTER_DIRECTIVES
}                             from '@angular/router';
import {AccountMenuComponent} from '../menu/account-menu.component';
import {PaymentService}       from "../../account/payment/payment.service";
import {UserService}          from "../../shared/services/user.service";


@Component( {
  moduleId: module.id,
  templateUrl: 'payment.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ],
  providers: [
    PaymentService
  ]
})

export class AccountAddCardComponent {
  PanelTitle:string = 'Find Services and add-ons';

  constructor(private _router: Router, private _userService: UserService, private _paymentService: PaymentService){}

  /**
  *  Add card information and billing address
  */
  public create(name, number, month, year, cvv, address, city, state, zipcode, country){
    let body = JSON.stringify({
      cardholder_name: name,
      number,
      expiration_date: `${month}/${year}`,
      cvv,
      address,
      city,
      zipcode,
      state,
      country
    });
    let user_id = this._userService.profile.id;
    this._paymentService.create(`/users/${user_id}/payments`, body)
      .subscribe((result) => {
          this._router.navigateByUrl('account');
        },
        error => {
          console.log("error:", error);
        });
  }
}
