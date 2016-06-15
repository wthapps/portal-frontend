import {Component}                                  from '@angular/core';
import {ROUTER_DIRECTIVES}                          from '@angular/router';
import {AccountMenuComponent}                       from './menu/account-menu.component';
import {Router, ROUTER_DIRECTIVES, RouteSegment}    from '@angular/router';
import {UserService}                                from '../shared/services/user.service';

@Component({
  moduleId: module.id,
  templateUrl: 'plans.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class PlansComponent {
  PanelTitle:string = 'Choose plan';
  
  paymentMethod: Object = {
    
  };

  constructor(private _router:Router, private _userService: UserService) {
    console.log("plans components:");
    
  }

  confirm():void {
    // this._router.navigateByUrl('account/setting/dashboard');
  }
}
