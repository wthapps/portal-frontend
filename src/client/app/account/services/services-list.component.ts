import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {UserService, CONFIG}  from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'services-list.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class AccountServicesListComponent {
  PanelTitle:string = 'Find Services';

  constructor(private _userService:UserService,
              private _router:Router) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }
}
