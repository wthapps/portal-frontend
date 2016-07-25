import {Component, OnInit}                          from '@angular/core';
import {Router, ROUTER_DIRECTIVES}                  from '@angular/router';
import {
  UserService,
  Constants,
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
  PanelTitle:string = 'Plans Options';
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
    private router: Router,
    private userService: UserService,
    private toastsService: ToastsService,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private planService: PlanService


  ) {
    if (!this.userService.loggedIn) {
      this.router.navigateByUrl(
        `/login;${Constants.params.next}=${this.router.location.path().replace(/\//g, '\%20')}`
      );
    }
  }

  ngOnInit() {

    this.planService.list('/plans')
    .subscribe((response) => {
      this.plans = response.data;
    },
    error => {
      console.log('get plans error', error);
    });
  }

  plan_has_product(products: Product[], product_name: string): boolean {
    for(let p of products) {
      if (p.name === product_name) return true;
    }
    return false;
  }

  confirm():void {
    this.router.navigateByUrl('account/setting/dashboard');
  }

  public choosePlan(plan_id: string) {


    if((plan_id != 'wth_free') && (this.userService.profile.has_payment_info == false)) {
      this.dialogService.activate(
      'Please add payment method before choosing a plan', 'Finish signing up account info'
      )
      .then((responseOK) => {
        if(responseOK) {
          this.router.navigate([`/account/payment`]);
          // this.router.navigate([`/account/payment;${Constants.string.next}=${this.router.location.path().replace(/\//, '%20')}`]);
        }
      });
      return;
    }

    let body: string = JSON.stringify({plan_id});

    this.dialogService.activate(
      'Confirm upgrading to Basic plan. You will pay $9.99 per month', 'Update plan confirmation'
      )
      .then((responseOK) => {
        if(responseOK) {
          this.loadingService.start();
          this.userService.choosePlan(`users/${this.userService.profile.id}`, body)
            .subscribe((response) => {
              this.selected_plan = plan_id;
              this.toastsService.success(response.message);
              this.loadingService.stop();
            },
            error => {
              this.toastsService.danger(error);
              this.loadingService.stop();
            });
        }
      });
  }
}
