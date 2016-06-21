import {Component}                                  from '@angular/core';
import {Router, ROUTER_DIRECTIVES}                  from '@angular/router';
import {UserService, CONFIG}                        from '../shared/index';
import {TopMessageService}                          from '../partials/topmessage/index';

@Component({
  moduleId: module.id,
  templateUrl: 'plans.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class PlansComponent {
  PanelTitle:string = 'Choose plan';
  plan

  paymentMethod:Object = {};

  constructor(private _router:Router,
              private _userService:UserService,
              private _toadMessageService: TopMessageService) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }

  confirm():void {
    // this._router.navigateByUrl('account/setting/dashboard');
  }

  public choosePlan(plan_id: string){
    let body: string = JSON.stringify({plan_id});

    this._userService.choosePlan(`users/${this._userService.profile.id}`, body)
      .subscribe((response) => {
        if (response.data != null){

        }
        this._toadMessageService.success(response.message);
      },
      error => {
        this._toadMessageService.danger(error);
      });
  }
}
