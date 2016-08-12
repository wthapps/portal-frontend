import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute }  from '@angular/router';

import { AppCardComponent } from '../../partials/index';
import { Product } from '../../shared/models/product.model';
import { ApiBaseService } from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'app-list.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AppCardComponent
  ],
  viewProviders: [
    ApiBaseService
  ],
  providers: [
    ApiBaseService
  ]
})

export class AccountAppsListComponent implements OnInit {
  pageTitle: string = '';
  services: any = [];
  errorMessage: string = 'errorMessage';
  categoriesName: any = [];
  top_apps: Array<Product> = [];
  new_apps: Array<Product> = [];
  featured_apps: Array<Product> = [];
  filtered_apps: Array<Product> = [];
  apps: Array<Product>;
  
  featured: string = '';              // detect selected featured
  private sub: any = null;
  private has_filter: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: ApiBaseService
    ) {
  }

  ngOnInit(): void {
    this.sub = this.router
      .routerState
      .queryParams
      .subscribe(params => {
        this.featured = params['featured'];
        
      });

    // get featured apps
    this.appService.get('apps?featured=featured').subscribe(
    (res: any) => {      
      this.featured_apps = res.data;
    },
    error => this.errorMessage = <any>error
    );
    
    // get top apps
    this.appService.get('apps?featured=top').subscribe(
    (res: any) => {      
      this.top_apps = res.data;
    },
    error => this.errorMessage = <any>error
    );

    // get new apps
    this.appService.get('apps?featured=new').subscribe(
    (res: any) => {      
      this.new_apps = res.data;
    },
    error => this.errorMessage = <any>error
    );

    this.getProducts();  
  }

  getProducts() {
    this.appService.get('apps').subscribe(
      (res: any) => {
        this.apps = res.data;        
      },
      error => this.errorMessage = <any>error
    );
  }

  onAppCardClicked(id: number): void {
    this.router.navigateByUrl(`/account/apps/${id}`);
  }

  onFilter(event: any, featured: string, category: string) {
    event.preventDefault();
    var query_string: string = '';

    if((featured == 'top') || (featured == 'new') || (featured == 'all')) {
      query_string = 'feature=' + featured;
      this.has_filter =  true;

      if(featured == 'top'){
        this.filtered_apps = this.top_apps;
      }else if(featured == 'new'){
        this.filtered_apps = this.new_apps;
      }else{
        this.filtered_apps = this.apps;
      }

      
    }else{
      this.router.navigate([`/account/apps`]);
      return;
    }
    
    let navigationExtras = {
      queryParams: { 'featured': featured }         
    };

    this.router.navigate([`/account/apps`], navigationExtras);
  }
}
