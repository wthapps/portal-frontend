import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Product } from '../../../core/shared/models/product.model';
import { ACAppsService } from '../apps.service';

@Component({
  moduleId: module.id,
  selector: 'ac-apps-list',
  templateUrl: 'list.component.html'
})

export class ACAppsListComponent implements OnInit {
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
  private has_filter: boolean = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private appsService: ACAppsService) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.featured = params['featured'];
    });

    // get featured apps
    this.appsService.listFeatured().subscribe(
      (res: any) => {
        this.featured_apps = res.data;
      },
      error => this.errorMessage = <any>error
    );

    // get top apps
    this.appsService.listTop().subscribe(
      (res: any) => {
        this.top_apps = res.data;
      },
      error => this.errorMessage = <any>error
    );

    // get new apps
    this.appsService.listNew().subscribe(
      (res: any) => {
        this.new_apps = res.data;
      },
      error => this.errorMessage = <any>error
    );

    this.getProducts();
  }

  getProducts() {
    this.appsService.list().subscribe(
      (res: any) => {
        this.apps = res.data;
      },
      (error: any) => this.errorMessage = <any>error
    );
  }

  onAppCardClicked(id: number): void {
    this.router.navigateByUrl(`/apps/${id}`);
  }

  onFilter(event: any, featured: string, category: string) {
    event.preventDefault();
    var query_string: string = '';

    if ((featured == 'top') || (featured == 'new') || (featured == 'all')) {
      query_string = 'feature=' + featured;
      this.has_filter = true;

      if (featured == 'top') {
        this.filtered_apps = this.top_apps;
      } else if (featured == 'new') {
        this.filtered_apps = this.new_apps;
      } else {
        this.filtered_apps = this.apps;
      }


    } else {
      this.router.navigate([`/apps`]);
      return;
    }

    let navigationExtras = {
      queryParams: {'featured': featured}
    };

    this.router.navigate([`/apps`], navigationExtras);
  }
}
