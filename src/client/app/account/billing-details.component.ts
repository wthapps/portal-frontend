import {Component}                    from '@angular/core';
import {ROUTER_DIRECTIVES, Router}    from '@angular/router';
import {UserService, CONFIG}          from '../shared/index';
import {LoadingService}               from '../partials/loading/loading.service';
import {DialogService}                from '../partials/dialogs/dialog.service';
import {TopMessageService}            from "../partials/topmessage/top-message.service";

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
    private _toadMessage: TopMessageService
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
          this._loadingService.stop();
        }
      });
  }
}
