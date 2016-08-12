import {Component, OnInit}                          from '@angular/core';
import {Router, ROUTER_DIRECTIVES}                  from '@angular/router';
import {
  UserService,
  LoadingService
}                                                   from '../shared/index';

import {PlanService}            from './plan.service';
import {Product}                from '../shared/models/product.model';
import {Plan}                   from '../shared/models/plan.model';


@Component({
  moduleId: module.id,
  templateUrl: 'plans.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [PlanService]
})

export class PlansComponent implements OnInit {
  pageTitle: string = 'Plan Options';

  products: Product[] = [];
  plans: Plan[] = [];


  constructor(private router: Router,
              private userService: UserService,
              private planService: PlanService,
              private loadingService: LoadingService) {
    //console.log(this.userService)
  }

  ngOnInit(): void {
    this.loadingService.start('#tablePlan');
    this.planService.list('apps/all') // TODO refactor with path /product; also refactor in API
      .subscribe((response: any) => {
          if (response.data !== null) {
            this.products = response.data;
            this.planService.list('plans')
              .subscribe((response: any) => {
                  if (response.data !== null) {
                    this.plans = response.data;
                  }
                  this.loadingService.stop('#tablePlan');
                },
                error => {
                  this.loadingService.stop('#tablePlan');
                  console.log('error plans: ', error.message);
                });
          }
        },
        error => {
          this.loadingService.stop('#tablePlan');
          console.log('error products: ', error.message);
        });
  }

  plan_has_product(products: any, product_name: string): boolean {
    for (let p of products) {
      if (p.name === product_name) return true;
    }
    return false;
  }

  getStarted(): void {
    console.log(this.userService);
    if (this.userService.profile.has_payment_info) {
      this.router.navigateByUrl('account/setting/profile');
    } else {
      this.router.navigateByUrl('account/payment');
    }

  }


  /*// TODO refactor below line
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
   name: 'Duluxe',
   description: '$9.99 all apps an services',
   price: 9.99,
   currency_iso_code: 'USD'
   })
   ];

   products = [
   new Product({id: 1, name: 'Pictures'}),
   new Product({id: 2, name: 'VPN'}),
   new Product({id: 1, name: 'DNS Server'}),
   new Product({id: 2, name: 'eFax'}),
   new Product({id: 1, name: 'Website Ping'}),
   new Product({id: 2, name: 'WTHmindmap'}),
   new Product({id: 1, name: 'WTHgadgets'}),
   new Product({id: 2, name: 'WTHaddons'}),
   new Product({id: 1, name: 'WTHcharts'}),
   new Product({id: 2, name: 'WTHoffice'}),
   new Product({id: 1, name: 'WTHwifi'}),
   new Product({id: 2, name: 'WTHchat'}),
   new Product({id: 1, name: 'WTHcontacts'}),
   new Product({id: 2, name: 'WTHcalendar'})
   ];

   planProducts = [
   new PlanProduct({
   id: 1,
   str_id: 'wth_free',
   name: 'Free',
   products: [
   new Product({id: 1, name: 'Pictures'})
   ]
   }),
   new PlanProduct({
   id: 2,
   str_id: 'wth_basic',
   name: 'Basic',
   products: [
   new Product({id: 1, name: 'Pictures'}),
   new Product({id: 2, name: 'VPN'}),
   new Product({id: 1, name: 'DNS Server'}),
   new Product({id: 2, name: 'eFax'}),
   new Product({id: 1, name: 'Website Ping'}),
   new Product({id: 2, name: 'WTHmindmap'}),
   new Product({id: 1, name: 'WTHgadgets'}),
   new Product({id: 2, name: 'WTHaddons'}),
   new Product({id: 1, name: 'WTHcharts'}),
   new Product({id: 2, name: 'WTHoffice'}),
   new Product({id: 1, name: 'WTHwifi'}),
   new Product({id: 2, name: 'WTHchat'}),
   new Product({id: 1, name: 'WTHcontacts'}),
   new Product({id: 2, name: 'WTHcalendar'})
   ]
   })
   ];

   constructor(private router: Router,
   private userService: UserService,
   private toastsService: ToastsService,
   private loadingService: LoadingService,
   private dialogService: DialogService,
   private planService: PlanService) {
   console.log(this.planService);
   }

   ngOnInit() {
   // this.planService.list('/plans')
   // .subscribe((response) => {
   //   this.plans = response.data;
   // },
   // error => {
   //   console.log('get plans error', error);
   // });
   }

   plan_has_product(products: any, product_name: string): boolean {
   for (let p of products) {
   if (p.name === product_name) return true;
   }
   return false;
   }

   confirm(): void {
   this.router.navigateByUrl('account/setting/profile');
   }

   public choosePlan(plan_id: string) {


   if ((plan_id != 'wth_free') && (this.userService.profile.has_payment_info == false)) {
   this.dialogService.activate(
   'Please add payment method before choosing a plan', 'Finish signing up account info'
   )
   .then((responseOK) => {
   if (responseOK) {
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
   if (responseOK) {
   this.loadingService.start();
   this.userService.choosePlan(`users/${this.userService.profile.id}`, body)
   .subscribe((response: any) => {
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
   }*/
}
