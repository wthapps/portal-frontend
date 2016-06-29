import {Component}                                  from '@angular/core';
import {Router, ROUTER_DIRECTIVES}                  from '@angular/router';
import {UserService, CONFIG, WthConstants}          from '../shared/index';
import {TopMessageService}                          from '../partials/topmessage/index';
import {DialogService}                              from "../partials/dialogs/dialog.service";
import {LoadingService}                             from "../partials/loading/loading.service";
import {WthCancelPlanComponent}                     from "../shared/wth.join.us.component";

@Component({
  moduleId: module.id,
  templateUrl: 'plans.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthCancelPlanComponent
  ]
})

export class PlansComponent {
  PanelTitle:string = 'Choose plan';

  paymentMethod:Object = {};

  constructor(
    private _router:Router,
    private _userService:UserService,
    private _toadMessageService: TopMessageService,
    private _loadingService: LoadingService,
    private _dialogService: DialogService
  ) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }

  confirm():void {
    // this._router.navigateByUrl('account/setting/dashboard');
  }

  public choosePlan(plan_id: string){
    // if( plan_id != 'wth_free'){
    //   this._router.navigateByUrl(`account/payment;${WthConstants.string.next}=${this._router._location.path().replace(WthConstants.patterns.slash, WthConstants.patterns.space)}`);
    //   return;
    // }

    let body: string = JSON.stringify({plan_id});

    this._dialogService.activate("Confirm upgrading to Basic plan. You will pay $9.99 per month", "Update plan confirmation")
      .then((responseOK) => {
        if(responseOK) {
          this._loadingService.start();
          this._userService.choosePlan(`users/${this._userService.profile.id}`, body)
            .subscribe((response) => {
              if (response.data != null){

              }
              this._toadMessageService.success(response.message);
              this._loadingService.stop();
            },
            error => {
              this._toadMessageService.danger(error);
              this._loadingService.stop();
            });

        }
      });
  }
}
