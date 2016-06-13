import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {AccountMenuComponent} from '../menu/account-menu.component';
import {UserService} from "../../shared/services/user.service";

@Component({
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class AccountDashboardComponent {

  constructor(private _router: Router, private _userService: UserService){}

  public choosePlans(event: any): void{
    event.preventDefault();
    if (this._userService.profile.has_payment_info === true){
      this._router.navigateByUrl('account/payment/confirm');
    }else{
      this._router.navigateByUrl('account/payment');
    }
  }
}
