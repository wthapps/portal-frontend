import {Component}                    from '@angular/core';
import {ROUTER_DIRECTIVES, Router}    from '@angular/router';
import {UserService, CONFIG}          from '../shared/index';
import {
  LoadingService,
  DialogService,
  ToastsService
}                                     from "../shared/index";
import {Cookie}                       from 'ng2-cookies/ng2-cookies'

@Component({
  moduleId: module.id,
  templateUrl: 'billing-details.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class BillingDetailsComponent {
  PanelTitle:string = 'Billing details';

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _loadingService: LoadingService,
    private _dialogService: DialogService,
    private _toastsService: ToastsService
  ) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }

  onEdit(event: any): void {
    event.preventDefault();
    this._router.navigateByUrl(`/account/payment;operation=edit;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
  }

  onDelete(event: any): void {
    event.preventDefault();
    this._dialogService.activate('Are you sure to delete Billing details?', 'Delete billing details')
      .then((responseOK) => {
        if(responseOK) {
          this._loadingService.start();
          this._userService.delete(`/users/${this._userService.profile.id}/payments/1`).subscribe(
            response => {
              this._loadingService.stop();
              this._toastsService.success("The billing details has been deleted.");
              this._userService.profile.has_payment_info = false;
              this._userService.profile.credit_cards = null;
              this._userService.profile.billing_address = null;
              Cookie.set('profile', JSON.stringify(this._userService.profile));
            },
            error => {
              this._loadingService.stop();
              this._toastsService.danger("Unable to delete the billing details.");
            }
          );
        }
      });
  }
}
