import {Component, OnInit}      from '@angular/core';
import {ROUTER_DIRECTIVES}      from '@angular/router';
import {
  WthJoinUsComponent,
  getStartedComponent
}                               from '../shared/wth.join.us.component';
import {PlanService}            from "../account/plan.service";
import {Product}                from "../shared/models/product.model";
import {Plan}                   from "../shared/models/plan.model";
import {PlanProduct}            from "../shared/models/plan-product.model";
import {UserService}            from "../shared/services/user.service";

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthJoinUsComponent,
    getStartedComponent
  ],
  providers: [PlanService]
})

export class HomeComponent implements OnInit{
  pageTitle:string = 'Home page';
  products: Product[] = [];

  // plans: PlanProduct[] = [];
  plans: PlanProduct[] = [
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

  constructor(private planService: PlanService, private userService: UserService){

  }

  ngOnInit(): void {
    this.planService.list('plans')
      .subscribe((response) => {
        if (response.data != null){
          this.plans = Array.from(response.data);
        }
      },
      error => {
        console.log("error plans: ", error.message);
      });

    this.planService.list('products/all')
      .subscribe((response) => {
          if (response.data != null){
            this.products = Array.from(response.data);
          }
        },
        error => {
          console.log("error products: ", error.message);
        });
  }

  plan_has_product(products: any, product_name: string): boolean {
    for(let p of products) {
      if (p.name === product_name) return true;
    }
    return false;
  }
}
