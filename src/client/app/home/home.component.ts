import {Component, OnInit, ElementRef, ViewChild}      from '@angular/core';
import {ROUTER_DIRECTIVES}      from '@angular/router';
import {
  WthJoinUsComponent,
  GetStartedComponent
}                               from '../shared/wth.join.us.component';
import {PlanService}            from '../account/plan.service';
import {Product}                from '../shared/models/product.model';
import {Plan}                   from '../shared/models/plan.model';
import {UserService}            from '../shared/services/user.service';
import {LoadingService}         from '../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthJoinUsComponent,
    GetStartedComponent
  ],
  providers: [PlanService]
})

export class HomeComponent implements OnInit {
  pageTitle:string = 'Home page';
  products: Product[] = [];
  plans: Plan[] = [];

  elementLoading:any;

  constructor(private planService: PlanService,
              private userService: UserService,
              private LoadingService: LoadingService,
              private ElementRef:ElementRef) {
    this.elementLoading = this.ElementRef.nativeElement;
  }

  ngOnInit(): void {
    this.LoadingService.start('#tablePlan');

    this.planService.list('plans')
      .subscribe((response) => {
        if (response.data !== null) {
          this.plans = response.data;
        }
      },
      error => {
        console.log('error plans: ', error.message);
      });

    this.planService.list('products/all') // TODO refactor with path /product; also refactor in API
      .subscribe((response) => {
          if (response.data !== null) {
            this.products = response.data;
          }
        },
        error => {
          console.log('error products: ', error.message);
      });

    this.LoadingService.stop('#tablePlan');
  }

  plan_has_product(products: any, product_name: string): boolean {
    for(let p of products) {
      if (p.name === product_name) return true;
    }
    return false;
  }
}
