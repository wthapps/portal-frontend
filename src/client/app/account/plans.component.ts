import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import {
  UserService,
  LoadingService,
  ApiBaseService
} from '../shared/index';

import { Product } from '../shared/models/product.model';
import { Plan } from '../shared/models/plan.model';


@Component({
  moduleId: module.id,
  templateUrl: 'plans.component.html'
})

export class PlansComponent implements OnInit {
  pageTitle: string = 'Plan Options';

  products: Product[] = [];
  plans: Plan[] = [];


  constructor(private router: Router,
              private loadingService: LoadingService,
              private userService: UserService,
              private apiService: ApiBaseService) {
    //console.log(this.userService)
  }

  ngOnInit(): void {
    this.loadingService.start('#tablePlan');
    this.apiService.get('apps/all') // TODO refactor with path /product; also refactor in API
      .subscribe((response: any) => {
          if (response.data !== null) {
            this.products = response.data;
            this.apiService.get('plans')
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

  getStarted(plan: Plan): void {

    var p = JSON.stringify({
      id: plan.id,
      name: plan.name,
      is_trial: plan.is_trial,
      price: plan.price
    });
    // Cookie.delete('selected_plan');
    Cookie.set('selected_plan', p, 365, '/');
    if (this.userService.profile.has_payment_info) {
      this.router.navigateByUrl('account/payment/confirm');
    } else {
      this.router.navigateByUrl('account/payment');
    }

  }
}
