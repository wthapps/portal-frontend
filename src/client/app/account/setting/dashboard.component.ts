import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteSegment} from '@angular/router';
import {UserService, CONFIG} from '../../shared/index';
import {WthJoinUsComponent, WthCancelPlanComponent} from '../../shared/wth.join.us.component';

@Component({
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthCancelPlanComponent,
    WthJoinUsComponent
  ]
})

export class AccountDashboardComponent implements OnInit {

  constructor(private _router:Router, private _userService:UserService, private _segment:RouteSegment) {
    console.log(this._userService);
  }

  ngOnInit():any {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }

  public choosePlans(event:any):void {
    event.preventDefault();
    if (this._userService.profile.has_payment_info === true) {
      this._router.navigateByUrl('account/plans');
    } else {
      this._router.navigateByUrl('account/payment');
    }
  }
}
