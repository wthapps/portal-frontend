import {Component}          from '@angular/core';
import {ROUTER_DIRECTIVES, Router}  from '@angular/router';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {UserService} from './services/user.service'

@Component({
  selector: 'wth-join-us',
  directives: [ROUTER_DIRECTIVES],
  template: `<a class="btn btn-get btn-danger mt20" href="javascript:;" (click)="redirectNextPage($event)" >
              {{textValue}}
             </a>
  `
})

export class WthJoinUs {
  
  public textValue: string;

  constructor(private _userService: UserService, private _router: Router){
    this.textValue = _userService.loggedIn ? 'Upgrade for only $9.99 per month' : 'Join Free for a Month';
  }
  
  public redirectNextPage(event) {
    event.preventDefault();

    if (!this._userService.loggedIn) this._router.navigateByUrl('/signup');
    if (this._userService.profile.has_payment_info) this._router.navigateByUrl('/account/plans');
    this._router.navigateByUrl('/account/payment');
  } 
}



