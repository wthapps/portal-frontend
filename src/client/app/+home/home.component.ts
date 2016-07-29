import { Component, OnInit } from '@angular/core';

import {
  WthJoinUsComponent,
  GetStartedComponent,
  LoadingService
}                               from '../shared/index';

import {PlanService}            from '../+account/plan.service';
import {Product}                from '../shared/models/product.model';
import {Plan}                   from '../shared/models/plan.model';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  directives: [
    WthJoinUsComponent,
    GetStartedComponent
  ],
  viewProviders: [
    PlanService
  ]
})

export class HomeComponent implements OnInit {
  pageTitle:string = 'Home page';
  products: Product[] = [];
  plans: Plan[] = [];


  constructor(private planService: PlanService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.loadingService.start('#tablePlan');
    this.planService.list('products/all') // TODO refactor with path /product; also refactor in API
      .subscribe((response:any) => {
          if (response.data !== null) {
            this.products = response.data;
            this.planService.list('plans')
              .subscribe((response:any) => {
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
    for(let p of products) {
      if (p.name === product_name) return true;
    }
    return false;
  }
}
