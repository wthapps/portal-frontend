import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CookieOptionsArgs } from 'angular2-cookie/services/cookie-options-args.model';

import { LoadingService } from '../loading/loading.service';
import { ApiBaseService } from '../../shared/services/apibase.service';
import { UserService } from '../../shared/services/user.service';
import { Plan } from '../../shared/models/plan.model';
import { Constants } from '../../shared/config/constants';

@Component({
  moduleId: module.id,
  selector: 'wth-table-pricing',
  templateUrl: 'table-pricing.component.html'
})

export class TablePricingComponent implements OnInit {
  pageTitle: string = 'Plan Options';

  products: Array<any> = [];
  plans: Array<any> = [];

  percentage: number = 1;


  private cookieOptionsArgs: CookieOptionsArgs = {
    path: '/',
    domain: Constants.baseUrls.domain,
    expires: new Date('2030-07-19')
  };

  constructor(private router: Router,
              private loadingService: LoadingService,
              public userService: UserService,
              private apiService: ApiBaseService,
              private cookieService: CookieService) {
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
                    this.percentage = response.data.length;
                  }
                  this.loadingService.stop('#tablePlan');
                },
                (error:any) => {
                  this.loadingService.stop('#tablePlan');
                  console.log('error plans: ', error.message);
                });
          }
        },
        (error:any) => {
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
    this.cookieService.put('selected_plan', p, this.cookieOptionsArgs);
    if (this.userService.profile && this.userService.profile.has_payment_info) {
      this.router.navigateByUrl('payment/confirm');
      // this.userService.getDefaultPayment()
      //   .subscribe((response: any) => {
      //
      //   },
      //   error => {
      //     console.log('error products: ', error.message);
      //   });
    } else {
      this.router.navigateByUrl('payment');
    }
  }
}
