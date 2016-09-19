import {Component, OnInit, HostBinding} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {
  WthJoinUsComponent,
  GetStartedComponent,
  FooterPromotionComponent,
  LoadingService,
  ApiBaseService
}                               from '../shared/index';

import {Product}                from '../shared/models/product.model';
import {Plan}                   from '../shared/models/plan.model';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'page-home',
  templateUrl: 'home.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthJoinUsComponent,
    GetStartedComponent,
    FooterPromotionComponent
  ],
  viewProviders: [
    ApiBaseService
  ]
})

export class HomeComponent implements OnInit {
  @HostBinding('attr.class') class = 'page-default';

  pageTitle: string = 'Home page';
  products: Product[] = [];
  plans: Plan[] = [];


  constructor(private apiService: ApiBaseService,
              private loadingService: LoadingService) {
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
          console.log('error apps: ', error.message);
        });
  }

  plan_has_product(products: any, product_name: string): boolean {
    for (let p of products) {
      if (p.name === product_name) return true;
    }
    return false;
  }
}
