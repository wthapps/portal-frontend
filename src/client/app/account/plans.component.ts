import {Component, OnInit}                          from '@angular/core';
import {Router, ROUTER_DIRECTIVES}                  from '@angular/router';
import {
  UserService,
  CONFIG,
  ToastsService,
  DialogService,
  LoadingService
}                                                   from '../shared/index';
import {WthCancelPlanComponent}                     from '../shared/wth.join.us.component';
import {PlanService}                                from './plan.service';
import {Plan}                                       from '../shared/models/plan.model';
import {Product}                                    from '../shared/models/product.model';
import {PlanProduct}                                from '../shared/models/plan-product.model';

@Component({
  moduleId: module.id,
  templateUrl: 'plans.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthCancelPlanComponent
  ],
  providers: [PlanService, UserService],
  styleUrls: ['plans.component.css']
})

export class PlansComponent implements OnInit {
  PanelTitle:string = 'Choose plan';
  // TODO refactor below line
  paymentMethod: Object = {};
  selected_plan: string = 'wth_free';
  plans = [
    new Plan({
      id: 1,
      str_id: 'wth_free',
      name: 'Free',
      description: 'Free a month',
      price: 0,
      currency_iso_code: 'USD'
    }),
     new Plan({
       id: 2,
       str_id: 'wth_basic',
       name: 'Basic',
       description: '$9.99 all apps an services',
       price: 9.99,
       currency_iso_code: 'USD'
     })
  ];

  products = [
    new Product({ id: 1, name: 'Pictures'}),
    new Product({ id: 2, name: 'VPN'}),
    new Product({ id: 1, name: 'DNS Server'}),
    new Product({ id: 2, name: 'eFax'}),
    new Product({ id: 1, name: 'Website Ping'}),
    new Product({ id: 2, name: 'WTHmindmap'}),
    new Product({ id: 1, name: 'WTHgadgets'}),
    new Product({ id: 2, name: 'WTHaddons'}),
    new Product({ id: 1, name: 'WTHcharts'}),
    new Product({ id: 2, name: 'WTHoffice'}),
    new Product({ id: 1, name: 'WTHwifi'}),
    new Product({ id: 2, name: 'WTHchat'}),
    new Product({ id: 1, name: 'WTHcontacts'}),
    new Product({ id: 2, name: 'WTHcalendar'})
  ];

  planProducts = [
    new PlanProduct({
      id: 1,
      str_id: 'wth_free',
      name: 'Free',
      products: [
        new Product({ id: 1, name: 'Pictures'})
      ]
    }),
    new PlanProduct({
      id: 2,
      str_id: 'wth_basic',
      name: 'Basic',
      products: [
        new Product({ id: 1, name: 'Pictures'}),
        new Product({ id: 2, name: 'VPN'}),
        new Product({ id: 1, name: 'DNS Server'}),
        new Product({ id: 2, name: 'eFax'}),
        new Product({ id: 1, name: 'Website Ping'}),
        new Product({ id: 2, name: 'WTHmindmap'}),
        new Product({ id: 1, name: 'WTHgadgets'}),
        new Product({ id: 2, name: 'WTHaddons'}),
        new Product({ id: 1, name: 'WTHcharts'}),
        new Product({ id: 2, name: 'WTHoffice'}),
        new Product({ id: 1, name: 'WTHwifi'}),
        new Product({ id: 2, name: 'WTHchat'}),
        new Product({ id: 1, name: 'WTHcontacts'}),
        new Product({ id: 2, name: 'WTHcalendar'})
      ]
    })
  ];

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _toastsService: ToastsService,
    private _loadingService: LoadingService,
    private _dialogService: DialogService,
    private _planService: PlanService


  ) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
  }

  ngOnInit() {

    // this._planService.list('/plans')
    //   .subscribe((response) => {
    //     this.plans = response.data
    //   },
    //   error => {

    //   });

  }

  plan_has_product(products: Product[], product_name: string): boolean {
    for(let p of products) {
      if (p.name === product_name) return true;
    }
    return false;
  }

  confirm():void {
    // this._router.navigateByUrl('account/setting/dashboard');
  }

  public choosePlan(plan_id: string) {
    // if( plan_id != 'wth_free'){
    //   this._router.navigateByUrl(`account/payment;${WthConstants.string.next}=${this._router._location.path().replace(WthConstants.patterns.slash, WthConstants.patterns.space)}`);
    //   return;
    // }

    let body: string = JSON.stringify({plan_id});

    this._dialogService.activate('Confirm upgrading to Basic plan. You will pay $9.99 per month', 'Update plan confirmation')
      .then((responseOK) => {
        if(responseOK) {
          this._loadingService.start();
          this._userService.choosePlan(`users/${this._userService.profile.id}`, body)
            .subscribe((response) => {
              if (response.data !== null) {

              }
              this.selected_plan = plan_id;
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
