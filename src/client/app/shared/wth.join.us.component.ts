import {Component}                  from '@angular/core';
import {ROUTER_DIRECTIVES, Router}  from '@angular/router';
import {
  UserService,
  DialogService,
  ToastsService,
  LoadingService
}                                   from './index';

@Component({
  selector: 'wth-join-us',
  directives: [ROUTER_DIRECTIVES],
  template: `<a class="btn btn-danger" href="javascript:;" 
              *ngIf="_userService.profile == null || !_userService.profile.has_payment_info || _userService.profile.plan_id == 'wth_free'"
              (click)="redirectNextPage($event)" >
              {{textValue}}
             </a>
  `
})

export class WthJoinUsComponent {

  public textValue:string;

  constructor(
    private _userService:UserService,
    private _router:Router
  ) {
    this.textValue = _userService.loggedIn ? 'Upgrade for only $9.99 per month' : 'Join Free for a Month';
  }

  public redirectNextPage(event) {
    event.preventDefault();
    if (this._userService.loggedIn) {
      if (this._userService.profile.has_payment_info) {
        this._router.navigateByUrl('/account/plans');
        return;
      }
      this._router.navigateByUrl('/account/payment');
      return;
    }
    this._router.navigateByUrl('/signup');
  }
}

@Component({
  selector: 'wth-cancel-plan',
  directives: [ROUTER_DIRECTIVES],
  template: `<a class="btn btn-danger ml20" href="javascript:;" 
              *ngIf="_userService.profile.has_payment_info && _userService.profile.plan_id !== 'wth_free'"
              (click)="onCancel('wth_free',$event)" >
              {{textValue}}
             </a>
  `
})
export class WthCancelPlanComponent {

  public textValue:string;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _dialogService: DialogService,
    private _toastsService: ToastsService,
    private _loadingService: LoadingService
  ) {
    this.textValue = 'Cancel current plan';
  }

  public onCancel(plan_id: string, event: any) {
    event.preventDefault();
    let body: string = JSON.stringify({plan_id});
    this._dialogService.activate("Confirm canceling Basic plan.", "Cancel plan confirmation")
      .then((responseOK) => {
        if(responseOK) {
          this._loadingService.start();
          this._userService.choosePlan(`users/${this._userService.profile.id}`, body)
            .subscribe((response) => {
              if (response.data != null){

              }
              this._toastsService.success(response.message);
              this._loadingService.stop();
            },
            error => {
              this._toastsService.danger(error);
              this._loadingService.stop();
            });
        }
      });
  }
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
      }
      this._router.navigateByUrl('/account/payment');
    }
    this._router.navigateByUrl('/signup');
  }
}
