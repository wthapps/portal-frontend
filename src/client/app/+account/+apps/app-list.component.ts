import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {
  AppCardComponent,
} from '../../partials/index';

import {Product} from '../../shared/models/product.model';

import {AppService} from './app.service';

declare var _: any;

@Component({
  moduleId: module.id,
  templateUrl: 'app-list.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AppCardComponent
  ],
  viewProviders: [
    AppService
  ]
})

export class AccountAppsListComponent implements OnInit {
  pageTitle: string = '';
  services: any = [];
  errorMessage: string = 'errorMessage';
  categoriesName: any = [];

  apps: Array<Product> = [{
    id: 1,
    uuid: '',
    name: 'Featured New App & Service No 01',
    display_name: 'Featured New App & Service No 01',
    download_link: 'assets/images/apps/icon.png',
    description: 'Featured New App & Service No 01',
    img_src: 'assets/images/apps/icon.png',
    template_id: 1,
    template_path: '',
    product_categories_id: 1,
    active: true,
    router_link: '',
    platforms: ['windows', 'apple', 'browser']
  }];
  //apps: Array<Product>;


  constructor(private router: Router,
              private appService: AppService) {
  }

  ngOnInit(): void {
    this.getProducts();
    //console.log(this.services);
  }

  getProducts() {
    this.appService.get('products').subscribe(
      (res: any) => {
        this.apps = res.data;
        console.log(res.data);
      },
      error => this.errorMessage = <any>error
    );
  }

  //products/categories/{id}

  onAppCardClicked(id: number): void {
    this.router.navigateByUrl(`/account/apps/${id}`);
  }
}
