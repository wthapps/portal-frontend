import {Component}                                  from '@angular/core';
import {Router, ROUTER_DIRECTIVES}    from '@angular/router';
import {UserService, CONFIG}                        from '../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'plans.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class PlansComponent {
  PanelTitle:string = 'Choose plan';

  paymentMethod:Object = {};

  constructor(private _router:Router,
              private _userService:UserService) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }

  confirm():void {
    // this._router.navigateByUrl('account/setting/dashboard');
  }
}
