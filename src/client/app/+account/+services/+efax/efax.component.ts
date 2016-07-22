import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {UserService, Constants}  from '../../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'efax.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class AccountServicesEFaxComponent {
  pageTitle:string = 'eFax Service';

  constructor(private _userService:UserService,
              private _router:Router) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${Constants.params.next}=${this._router.location.path().replace(/\//g, '\%20')}`);
    }
  }
}
