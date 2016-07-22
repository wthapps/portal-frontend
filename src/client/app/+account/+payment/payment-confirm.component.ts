import {Component}                          from '@angular/core';
import {Router, ROUTER_DIRECTIVES}           from '@angular/router';
import {PaymentService}                     from './payment.service';
import {UserService, Constants}                from '../../shared/index';

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

  constructor(private router:Router,
              private userService:UserService,
              private paymentService:PaymentService) {

    if (!this.userService.loggedIn) {
      this.router.navigateByUrl(`/login;${Constants.params.next}=${this.router.location.path().replace(/\//g, '\%20')}`);
    }

  }

  confirm():void {
    this.router.navigateByUrl('account/setting/dashboard');
  }
}
