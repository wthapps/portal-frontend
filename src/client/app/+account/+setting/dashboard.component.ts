import {
  Component,
  OnInit,
  OnDestroy
}                       from '@angular/core';
import {
  Router,
  ROUTER_DIRECTIVES
}                       from '@angular/router';
import {
  UserService,
  WthJoinUsComponent,
  WthCancelPlanComponent,
  DialogService
}                       from '../../shared/index';
import {
  ContentPresenterComponent
}                       from '../+services/content-presenter.component';
import {
  StreamEmitter
}                       from '../../shared/index';
import {
  DashboardUserProductsViewModel
}                       from './dashboard-user-products.viewmodel';
import {
  ServicesService
}                       from '../+services/services.service';

@Component({
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthCancelPlanComponent,
    WthJoinUsComponent,
    ContentPresenterComponent
  ]
})

export class AccountDashboardComponent implements OnInit, OnDestroy {
  public user_products_context:DashboardUserProductsViewModel;

  constructor(private _router:Router,
              private _userService:UserService,
              private _streamEmitter:StreamEmitter,
              private _servicesService:ServicesService,
              private _dialogService:DialogService) {
  }

  ngOnInit():void {
    this.load();
  }

  ngOnDestroy() {
    this.unload();
  }

  //@TODO: should have viewmodel
  public choosePlans(event:any):void {
    event.preventDefault();
    if (this._userService.profile.has_payment_info === true) {
      this._router.navigateByUrl('account/plans');
    } else {
      this._router.navigateByUrl('account/payment');
    }
  }

  private validateLogin():boolean {
    return true;
  }

  private load():void {
    if (this.validateLogin()) {
      if (this.user_products_context == null) {
        this.user_products_context = new DashboardUserProductsViewModel(
          this._streamEmitter,
          this._servicesService,
          this._dialogService,
          this._router
        );
      }
      this.user_products_context.load();
    }
  }

  private unload():void {
    if (this.user_products_context != null) {
      this.user_products_context.unload();
    }
  }
}
