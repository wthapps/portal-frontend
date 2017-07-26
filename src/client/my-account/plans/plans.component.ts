import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService, CookieOptions } from 'ngx-cookie';

import { Product } from '../../core/shared/models/product.model';
import { Plan } from '../../core/shared/models/plan.model';
import { UserService } from '../../core/shared/services/user.service';
import { Constants } from '../../core/shared/config/constants';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { MyPlansService } from './plans.service';

@Component({
  moduleId: module.id,
  selector: 'my-plans',
  templateUrl: 'plans.component.html'
})

export class MyPlansComponent implements OnInit {
  pageTitle: string = 'Plan Options';

  products: Product[] = [];
  plans: Plan[] = [];

  private cookieOptionsArgs: CookieOptions = {
    path: '/',
    domain: Constants.baseUrls.domain,
    expires: new Date('2030-07-19')
  };

  constructor(private router: Router,
              private loadingService: LoadingService,
              private userService: UserService,
              private plansService: MyPlansService,
              private cookieService: CookieService) {
    //console.log(this.userService)
  }

  ngOnInit(): void {
    this.loadingService.start('#tablePlan');
    this.plansService.list().subscribe(
      (response: any) => {
        if (response.data !== null) {
          this.products = response.data;
          this.plansService.get().subscribe((response: any) => {
              if (response.data !== null) {
                this.plans = response.data;
              }
              this.loadingService.stop('#tablePlan');
            },
            (error: any) => {
              this.loadingService.stop('#tablePlan');
              console.log('error plans: ', error.message);
            });
        }
      },
      (error: any) => {
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
    this.cookieService.put('selected_plan', p, this.cookieOptionsArgs);
    if (this.userService.profile.has_payment_info) {
      this.router.navigateByUrl('payment/confirm');
    } else {
      this.router.navigateByUrl('payment');
    }

  }
}
