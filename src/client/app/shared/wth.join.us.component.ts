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

export class WthJoinUsComponent {

  public textValue:string;

  constructor(private _userService:UserService,
              private _router:Router) {
    this.textValue = _userService.loggedIn ? 'Upgrade for only $9.99 per month' : 'Join Free for a Month';
  }

  public redirectNextPage(event) {
    event.preventDefault();
    if (this._userService.loggedIn) {
      if (this._userService.profile.has_payment_info) {
        this._router.navigateByUrl('/account/plans');
        return false;
      }
      this._router.navigateByUrl('/account/payment');
      return false;
    }
    this._router.navigateByUrl('/signup');
  }
}


@Component({
  selector: 'wth-get-started',
  directives: [ROUTER_DIRECTIVES],
  template: `<a class="btn btn-get btn-danger" href="javascript:;" (click)="redirectNextPage($event)" >
              {{textValue}}
             </a>
  `
})

export class getStartedComponent {

  public textValue:string = 'Get Started';

  constructor(private _userService:UserService,
              private _router:Router) {}

  public redirectNextPage(event) {
    event.preventDefault();
    if (this._userService.loggedIn) {
      if (this._userService.profile.has_payment_info) {
        this._router.navigateByUrl('/account/plans');
        return false;
      }
      this._router.navigateByUrl('/account/payment');
      return false;
    }
    this._router.navigateByUrl('/signup');
  }
}
