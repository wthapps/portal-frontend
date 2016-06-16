import {Component}                          from '@angular/core';
import {Router,ROUTER_DIRECTIVES}           from '@angular/router';
import {PaymentService}                     from '../payment.service';
import {UserService}                        from '../../shared/services/user.service';

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
  }

  confirm():void {
    this._router.navigateByUrl('account/setting/dashboard');
  }
}
