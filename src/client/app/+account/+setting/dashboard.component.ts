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
  WthCancelPlanComponent
}                       from '../../shared/index';
import  { ServicesService } from '../+services/services.service';


@Component({
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthCancelPlanComponent,
    WthJoinUsComponent
  ],
  providers: [ServicesService]
})

export class AccountDashboardComponent implements OnInit, OnDestroy {

  has_installed_apps: boolean = false;
  installed_apps: any = [];
  is_invalid_plan: boolean = false;
  plan_name: string = '';

  constructor(private _router:Router,  private _userService:UserService, private appsService: ServicesService) {
  }

  ngOnInit():void {
    // this.load();
    this.plan_name = this._userService.profile.plan_id == 'wth_free' ? 'Free' : 'Deluxe';
    this.appsService.getUserProducts().subscribe(
      response => {
        this.has_installed_apps = response.length > 0 ? true : false;
        this.installed_apps = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    // this.unload();
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

  onRemove(event: any, product: any) {
    console.log('on remove');
  }

  // private validateLogin():boolean {
  //   return true;
  // }
  //
  // private load():void {
  //   if (this.validateLogin()) {
  //     if (this.user_products_context == null) {
  //       this.user_products_context = new DashboardUserProductsViewModel(
  //         this._streamEmitter,
  //         this._servicesService,
  //         this._dialogService,
  //         this._router
  //       );
  //     }
  //     this.user_products_context.load();
  //   }
  // }
  //
  // private unload():void {
  //   if (this.user_products_context != null) {
  //     this.user_products_context.unload();
  //   }
  // }
}
