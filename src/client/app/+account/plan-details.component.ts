import {Component}                    from '@angular/core';
import {ROUTER_DIRECTIVES, Router}    from '@angular/router';
import {UserService, Constants}          from '../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'plan-details.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class PlanDetailsComponent {
  PanelTitle:string = 'Plan details';

  constructor(private _userService:UserService,
              private _router:Router) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${Constants.params.next}=${this._router.location.path().replace(/\//g, '\%20')}`);
    }
  }
}
