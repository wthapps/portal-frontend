import {Component}                          from '@angular/core';
import {Router, ROUTER_DIRECTIVES}           from '@angular/router';
import {PaymentService}                     from '../payment.service';
import {UserService, CONFIG}                from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'payment-confirm.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    PaymentService
  ]
})

export class PaymentConfirmComponent {
  PanelTitle:string = 'Confirm Your Purchase';

  constructor(private _router:Router,
              private _userService:UserService,
              private _paymentService:PaymentService) {

    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

  }

  confirm():void {
    this._router.navigateByUrl('account/setting/dashboard');
  }
}
