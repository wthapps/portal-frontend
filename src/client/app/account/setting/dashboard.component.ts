import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteSegment} from '@angular/router';
import {UserService, CONFIG} from "../../shared/index";

@Component({
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class AccountDashboardComponent {

  constructor(private _router: Router, private _userService: UserService, private _segment: RouteSegment){
    if (!this._userService.loggedIn){
      _router.navigateByUrl(`/login;${CONFIG.string.next}=${this._router._location.path().replace(/\//g, "\%20")}`);
    }
  }

  public choosePlans(event: any): void{
    event.preventDefault();
    if (this._userService.profile.has_payment_info === true){
      this._router.navigateByUrl('account/plans');
    }else{
      this._router.navigateByUrl('account/payment');
    }
  }
}
